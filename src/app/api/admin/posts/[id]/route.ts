
import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import {prisma} from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    // 1. Verify admin authentication
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Get and validate the post ID
    const { id } = await params;

    if (!id || !id.trim()) {
      return NextResponse.json(
        { error: "A valid post ID is required." },
        { status: 400 }
      );
    }

    // 3. Parse the request body
    const body = await request.json();

    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      categoryId,
      tags,
      featured,
      status,
    } = body;

    // 4. Validate required fields
    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof slug !== "string" ||
      !slug.trim() ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return NextResponse.json(
        {
          error: "Title, slug, and content are required.",
        },
        { status: 400 }
      );
    }

    if (
      status !== undefined &&
      !["DRAFT", "PUBLISHED"].includes(status)
    ) {
      return NextResponse.json(
        { error: "Invalid post status." },
        { status: 400 }
      );
    }

    if (tags !== undefined && !Array.isArray(tags)) {
      return NextResponse.json(
        { error: "Tags must be an array." },
        { status: 400 }
      );
    }

    if (
      featured !== undefined &&
      typeof featured !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Featured must be true or false." },
        { status: 400 }
      );
    }

    // 5. Check whether the post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 }
      );
    }

    // 6. Check whether another post uses this slug
    const slugOwner = await prisma.post.findFirst({
      where: {
        slug: slug.trim(),
        NOT: { id },
      },
      select: { id: true },
    });

    if (slugOwner) {
      return NextResponse.json(
        {
          error:
            "This slug is already being used by another post.",
        },
        { status: 409 }
      );
    }

    // 7. Update the post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: title.trim(),
        slug: slug.trim(),
        content,
        excerpt:
          typeof excerpt === "string" ? excerpt : "",
        coverImage:
          typeof coverImage === "string" && coverImage.trim()
            ? coverImage.trim()
            : null,
        categoryId:
          typeof categoryId === "string" && categoryId.trim()
            ? categoryId
            : null,
        tags: Array.isArray(tags)
          ? tags.filter(
              (tag): tag is string =>
                typeof tag === "string" && tag.trim().length > 0
            )
          : undefined,
        featured:
          typeof featured === "boolean" ? featured : undefined,
        status,
      },
    });

    // 8. Return the updated post
    return NextResponse.json(
      {
        message: "Post updated successfully.",
        post: updatedPost,
      },
      { status: 200 }
    );
   } catch (error: unknown) {
    console.error("Update post error:", error);

    const errorCode =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof error.code === "string"
        ? error.code
        : undefined;

    if (errorCode === "P2002") {
      return NextResponse.json(
        { error: "A post with this slug already exists." },
        { status: 409 }
      );
    }

    if (errorCode === "P2025") {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred while updating the post." },
      { status: 500 }
    );
  }
}
