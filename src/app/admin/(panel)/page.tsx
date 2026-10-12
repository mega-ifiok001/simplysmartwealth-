import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-session";
import Icon from "./Icon";

export const metadata = {
  title: "Admin Dashboard | Simply Smart Money",
  robots: {
    index: false,
    follow: false,
  },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function AdminDashboardPage() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  const [totalPosts, publishedPosts, draftPosts, subscribers, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.newsletterSubscriber.count({
        where: { isSubscribed: true },
      }),
      prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

  const stats = [
    {
      label: "All blogs",
      value: totalPosts,
      icon: "file",
      tone: "bg-[#EAF1FD] text-[#315B9A]",
    },
    {
      label: "Published",
      value: publishedPosts,
      icon: "check",
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Drafts",
      value: draftPosts,
      icon: "draft",
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: "Subscribers",
      value: subscribers,
      icon: "users",
      tone: "bg-violet-50 text-violet-600",
    },
  ];

  const publishedPercent =
    totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0;

  const firstName = admin.name.split(" ")[0];

  return (
    <div className="px-5 py-8 sm:px-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Welcome back, {firstName}.
        </h1>
        <p className="mt-2 text-sm text-[#647188]">
          Here&apos;s what&apos;s happening with Simply Smart Money today.
        </p>
      </div>

      {/* Stats */}
      <section
        aria-label="Publication statistics"
        className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-[#E5EAF1] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#647188]">{stat.label}</p>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.tone}`}
              >
                <Icon name={stat.icon} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">
              {stat.value.toLocaleString()}
            </p>
          </article>
        ))}
      </section>

      {/* Content grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent blogs */}
        <section className="rounded-2xl border border-[#E5EAF1] bg-white shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#E5EAF1] px-6 py-4">
            <h2 className="font-semibold">Recent blogs</h2>
            <Link
              href="/admin/posts"
              className="text-sm font-semibold text-[#315B9A] hover:text-[#3976D8]"
            >
              View all →
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <p className="font-medium">No blogs yet</p>
              <p className="mt-2 text-sm text-[#647188]">
                Write your first money guide to get started.
              </p>
              <Link
                href="/admin/posts/new"
                className="mt-5 inline-block rounded-xl bg-[#14233B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263D60]"
              >
                Create blog
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-[#EEF1F6]">
              {recentPosts.map((post) => {
                const isPublished = post.status === "PUBLISHED";
                const isDraft = post.status === "DRAFT";

                return (
                  <li
                    key={post.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {post.title}
                      </p>
                      <p className="mt-1 text-xs text-[#647188]">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
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

                      {isPublished && (
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-xs font-semibold text-[#315B9A] hover:text-[#3976D8]"
                        >
                          View ↗
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Right column */}
        <div className="space-y-6">
          {/* Publishing progress */}
          <section className="rounded-2xl border border-[#E5EAF1] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Publishing progress</h2>
              <span className="text-sm font-semibold text-[#315B9A]">
                {publishedPercent}%
              </span>
            </div>

            <div
              className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#EEF1F6]"
              role="progressbar"
              aria-valuenow={publishedPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Share of blogs published"
            >
              <div
                className="h-full rounded-full bg-[#3976D8] transition-all"
                style={{ width: `${publishedPercent}%` }}
              />
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-[#647188]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Published
                </dt>
                <dd className="font-semibold">{publishedPosts}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-[#647188]">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Drafts
                </dt>
                <dd className="font-semibold">{draftPosts}</dd>
              </div>
            </dl>
          </section>

          {/* Quick actions */}
          <section className="rounded-2xl border border-[#E5EAF1] bg-white p-6 shadow-sm">
            <h2 className="font-semibold">Quick actions</h2>
            <div className="mt-4 space-y-2">
              <Link
                href="/admin/posts/new"
                className="flex items-center gap-3 rounded-xl border border-[#E5EAF1] px-4 py-3 text-sm font-semibold transition hover:border-[#3976D8] hover:bg-[#FAFBFD]"
              >
                <Icon name="plus" className="h-4 w-4 text-[#3976D8]" />
                Create blog
              </Link>
              <Link
                href="/admin/posts"
                className="flex items-center gap-3 rounded-xl border border-[#E5EAF1] px-4 py-3 text-sm font-semibold transition hover:border-[#3976D8] hover:bg-[#FAFBFD]"
              >
                <Icon name="file" className="h-4 w-4 text-[#3976D8]" />
                Manage blogs
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-3 rounded-xl border border-[#E5EAF1] px-4 py-3 text-sm font-semibold transition hover:border-[#3976D8] hover:bg-[#FAFBFD]"
              >
                <Icon name="external" className="h-4 w-4 text-[#3976D8]" />
                Live blog page
              </Link>

              
        
            </div>
          </section>
        </div>
      </div>

      <p className="mt-8 text-xs leading-6 text-[#7B8798]">
        Signed in as {admin.email}. Your administrator session expires after
        eight hours.
      </p>
    </div>
  );
}