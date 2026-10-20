
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id?.trim()) {
      return NextResponse.json(
        { error: "A valid post ID is required." },
        { status: 400 }
      );
    }

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

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof slug !== "string" ||
      !slug.trim() ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return NextResponse.json(
        { error: "Title, slug, and content are required." },
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

    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 }
      );
    }

    const cleanSlug = slug.trim();

    const slugOwner = await prisma.post.findFirst({
      where: {
        slug: cleanSlug,
        NOT: { id },
      },
      select: { id: true },
    });

    if (slugOwner) {
      return NextResponse.json(
        {
          error: "This slug is already being used by another post.",
        },
        { status: 409 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: title.trim(),
        slug: cleanSlug,
        content,
        excerpt:
          typeof excerpt === "string" ? excerpt : "",
        coverImage:
          typeof coverImage === "string" && coverImage.trim()
            ? coverImage.trim()
            : null,
        categoryId:
          typeof categoryId === "string" && categoryId.trim()
            ? categoryId.trim()
            : null,
        tags:
          Array.isArray(tags)
            ? tags.filter(
                (tag): tag is string =>
                  typeof tag === "string" &&
                  tag.trim().length > 0
              )
            : undefined,
        featured:
          typeof featured === "boolean"
            ? featured
            : undefined,
        status,
      },
    });

    // Refresh public pages and the admin list.
    revalidatePath(`/blog/${existingPost.slug}`);
    revalidatePath(`/blog/${updatedPost.slug}`);
    revalidatePath("/blog");
    revalidatePath("/admin/posts");

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
      {
        error:
          "An unexpected error occurred while updating the post.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id?.trim()) {
      return NextResponse.json(
        { error: "A valid post ID is required." },
        { status: 400 }
      );
    }

    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { id },
    });

    // Refresh the public blog and admin pages.
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/blog");
    revalidatePath("/admin/posts");

    return NextResponse.json(
      {
        success: true,
        message: "Post deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Delete post error:", error);

    const errorCode =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof error.code === "string"
        ? error.code
        : undefined;

    if (errorCode === "P2025") {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Unable to delete this post. It may be linked to other records.",
      },
      { status: 500 }
    );
  }
}
