
import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import {prisma} from "@/lib/prisma";
import PostEditorForm from "../../../posts/new/PostEditorForm";

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({
  params,
}: EditPostPageProps) {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
    }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8">
        <p className="text-sm font-medium text-[#d9532a]">
          SimplySmartWealth
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Edit blog post
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Update your article and save your changes.
        </p>
      </div>

      <PostEditorForm
        categories={categories}
        initialPost={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          coverImage: post.coverImage ?? "",
          categoryId: post.categoryId ?? "",
          tags: post.tags ?? [],
          featured: post.featured,
          status:
  post.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        }}
      />
    </div>
  );
}
