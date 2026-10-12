
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const commentSchema = z.object({
  authorName: z.string().trim().min(2).max(60),
  authorEmail: z.union([z.string().trim().email().max(254), z.literal("")]).optional(),
  content: z.string().trim().min(3).max(2000),
  parentId: z.string().cuid().optional(),
});

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { slug } = await params;

    const post = await prisma.post.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "This article could not be found." },
        { status: 404 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Please submit a valid comment." },
        { status: 400 }
      );
    }

    const parsed = commentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Check your name, email, and comment, then try again." },
        { status: 400 }
      );
    }

    const { authorName, authorEmail, content, parentId } = parsed.data;

    if (parentId) {
      const parent = await prisma.comment.findFirst({
        where: {
          id: parentId,
          postId: post.id,
          status: "APPROVED",
          parentId: null,
        },
        select: { id: true },
      });

      if (!parent) {
        return NextResponse.json(
          { error: "This comment is no longer available for replies." },
          { status: 400 }
        );
      }
    }

    const comment = await prisma.comment.create({
      data: {
        authorName,
        authorEmail: authorEmail || null,
        content,
        status: "APPROVED",
        postId: post.id,
        parentId: parentId ?? null,
      },
      select: { id: true },
    });

    return NextResponse.json(
      {
        success: true,
        commentId: comment.id,
        message: "Your submission is awaiting approval.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Comment submission failed:", error);

    return NextResponse.json(
      { error: "We couldn't submit your comment. Please try again later." },
      { status: 500 }
    );
  }
}
