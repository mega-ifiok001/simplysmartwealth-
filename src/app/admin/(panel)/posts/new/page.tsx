import { redirect } from "next/navigation";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-session";
import PostEditorForm from "./PostEditorForm";

export const metadata = {
  title: "Create Blog | Simply Smart Money",
  robots: { index: false, follow: false },
};

async function NewBlogContent() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3976D8]">
          Publication workspace
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Create a new blog
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#647188]">
          Turn practical money knowledge into clear, helpful guides that
          empower your readers to make smarter financial decisions.
        </p>
      </div>

      <PostEditorForm categories={categories} />

      <p className="mt-8 text-center text-xs leading-6 text-[#7B8798]">
        Simply Smart Money · Practical money tips for everyday life.
      </p>
    </div>
  );
}

export default function NewBlogPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-[#647188]">Loading blog editor...</div>
      }
    >
      <NewBlogContent />
    </Suspense>
  );
}