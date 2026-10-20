
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-session";
import DeletePostButton from "./DeletePostButton";

export const metadata = {
  title: "Manage Blogs | SimplySmartWealth",
  robots: { index: false, follow: false },
};

async function PostsContent() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      updatedAt: true,
      category: {
        select: { name: true },
      },
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3976D8]">
            Publication workspace
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Manage blogs
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#647188]">
            Create, review and organise your money guides.
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex items-center justify-center rounded-xl bg-[#14233B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263D60]"
        >
          + Create blog
        </Link>
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-[#E5EAF1] bg-white shadow-sm">
        <div className="border-b border-[#E5EAF1] px-5 py-4">
          <h2 className="font-semibold">
            All blogs ({posts.length})
          </h2>
        </div>

        {posts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF1FD] text-[#315B9A]">
              ✎
            </div>

            <h3 className="mt-4 font-semibold">
              Your first blog starts here
            </h3>

            <p className="mt-2 text-sm text-[#647188]">
              Create a practical money guide for your readers.
            </p>

            <Link
              href="/admin/posts/new"
              className="mt-5 inline-flex rounded-xl bg-[#14233B] px-4 py-3 text-sm font-semibold text-white hover:bg-[#263D60]"
            >
              Create your first blog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFBFD] text-[#647188]">
                <tr>
                  <th className="px-5 py-4 font-medium">Blog</th>
                  <th className="px-5 py-4 font-medium">Category</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">
                    Last updated
                  </th>
                  <th className="px-5 py-4 font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5EAF1]">
                {posts.map((post) => {
                  const isPublished = post.status === "PUBLISHED";
                  const isDraft = post.status === "DRAFT";

                  return (
                    <tr
                      key={post.id}
                      className="transition hover:bg-[#FAFBFD]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">
                          {post.title}
                        </p>

                        <p className="mt-1 text-xs text-[#647188]">
                          /blog/{post.slug}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-[#647188]">
                        {post.category?.name ?? "Uncategorised"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isPublished
                              ? "bg-emerald-50 text-emerald-700"
                              : isDraft
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isPublished
                            ? "Published"
                            : isDraft
                              ? "Draft"
                              : String(post.status)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-[#647188]">
                        {post.updatedAt.toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="font-semibold text-[#315B9A] transition hover:text-[#3976D8]"
                          >
                            Edit
                          </Link>

                          <DeletePostButton
                            postId={post.id}
                            postTitle={post.title}
                            postSlug={post.slug}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default function AdminPostsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-[#647188]">
          Loading blogs...
        </div>
      }
    >
      <PostsContent />
    </Suspense>
  );
}
