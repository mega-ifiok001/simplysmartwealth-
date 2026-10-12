
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE_NAME,
  adminSessionCookieOptions,
  createAdminSession,
} from "@/lib/admin-session";

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter a valid email and password." },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const { password } = parsed.data;

    const admin = await prisma.adminUser.findUnique({
      where: { email },
      select: {
        id: true,
        passwordHash: true,
        role: true,
      },
    });

    // Use the same response for an unknown email and a wrong password.
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await createAdminSession(admin.id, admin.role);

    const response = NextResponse.json({
      success: true,
      redirectTo: "/admin",
    });

    response.cookies.set(
      ADMIN_COOKIE_NAME,
      token,
      adminSessionCookieOptions
    );

    return response;
  } catch (error) {
    console.error("Admin login failed:", error);

    return NextResponse.json(
      { error: "Unable to sign in right now. Please try again." },
      { status: 500 }
    );
  }
}
