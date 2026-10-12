
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const action = formData.get("action");

    if (
      typeof id !== "string" ||
      !id.trim() ||
      action !== "read"
    ) {
      return NextResponse.json(
        { error: "Invalid contact message request." },
        { status: 400 }
      );
    }

    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.redirect(
      new URL(
        `/admin/contact?id=${encodeURIComponent(id)}`,
        request.url
      ),
      303
    );
  } catch (error) {
    console.error("Mark contact message as read error:", error);

    return NextResponse.json(
      { error: "Unable to update this message." },
      { status: 500 }
    );
  }
}
