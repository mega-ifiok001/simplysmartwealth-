
import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export const ADMIN_COOKIE_NAME = "ssm_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function getSessionSecret(): Uint8Array {
  const value = process.env.ADMIN_SESSION_SECRET;

  if (!value || value.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be configured with a strong secret."
    );
  }

  return new TextEncoder().encode(value);
}

export async function createAdminSession(
  adminId: string,
  role: "ADMIN" | "EDITOR"
): Promise<string> {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(adminId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecret());
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSessionSecret(), {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.sub !== "string" ||
      (payload.role !== "ADMIN" && payload.role !== "EDITOR")
    ) {
      return null;
    }

    // Confirm the account still exists and still has this role.
    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!admin || admin.role !== payload.role) return null;

    return admin;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getAdminSession();

  if (!admin) {
    throw new Error("UNAUTHORIZED");
  }

  return admin;
}

export const adminSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
};
