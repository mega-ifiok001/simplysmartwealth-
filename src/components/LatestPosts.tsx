
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

async function LatestPostsContent() {
  await connection();

  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
    orderBy: [
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    take: 3,
  });

  const coverStyles = [
    "cover-blue",
    "cover-sand",
    "cover-green",
  ];

  if (posts.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#D7DFEA] px-6 py-14 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF1FD] text-2xl text-[#315B9A]">
          ✦
        </div>

        <h3 className="mt-5 text-xl font-semibold">
          Your next money lesson is on its way.
        </h3>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#647188]">
          We're preparing practical guides on saving, budgeting, online income,
          and side hustles. New articles will appear here when published.
        </p>

        <Link
          href="/blog"
          className="mt-6 inline-flex rounded-full bg-[#14233B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#263D60]"
        >
          Visit the blog →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <article key={post.id} className="group min-w-0">
          <Link
            href={`/blog/${post.slug}`}
            aria-label={`Read ${post.title}`}
            className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3976D8]"
          >
            <div
              className={`relative flex h-56 items-center justify-center overflow-hidden rounded-2xl ${
                coverStyles[index % coverStyles.length]
              }`}
            >
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <>
                  <span className="absolute -right-8 -top-12 h-48 w-48 rounded-full border border-current/10 transition duration-500 group-hover:scale-110" />
                  <span className="absolute -right-2 -top-6 h-36 w-36 rounded-full border border-current/10 transition duration-500 group-hover:scale-110" />
                  <span className="relative text-7xl font-light opacity-80 transition duration-500 group-hover:scale-125 group-hover:rotate-3">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </>
              )}

              <span className="absolute bottom-4 left-4 rounded-full bg-white/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#14233B]">
                SimplySmartWealth
              </span>

              <span className="absolute bottom-4 right-4 translate-y-2 rounded-full bg-[#14233B] px-3 py-2 text-xs font-semibold text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                Read more ↗
              </span>
            </div>

            <div className="pt-5">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em]">
                <span className="text-[#3976D8]">
                  {post.category?.name ?? "Personal Finance"}
                </span>
                <span className="text-[#C1C8D2]">•</span>
                <span className="text-[#7B8798]">
                  {post.readingTime} min read
                </span>
              </div>

              <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-[#315B9A] sm:text-2xl">
                {post.title}
              </h3>

              <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#647188]">
                {post.excerpt}
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#315B9A]">
                Read article <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

function LatestPostsLoading() {
  return (
    <div
      className="grid gap-7 md:grid-cols-2 lg:grid-cols-3"
      aria-label="Loading latest articles"
      aria-busy="true"
    >
      {[1, 2, 3].map((item) => (
        <div key={item} className="animate-pulse">
          <div className="h-56 rounded-2xl bg-[#F4F7FC]" />
          <div className="mt-5 h-4 w-1/3 rounded bg-[#F4F7FC]" />
          <div className="mt-4 h-6 w-4/5 rounded bg-[#F4F7FC]" />
          <div className="mt-3 h-4 w-full rounded bg-[#F4F7FC]" />
          <div className="mt-2 h-4 w-2/3 rounded bg-[#F4F7FC]" />
        </div>
      ))}
    </div>
  );
}

export default function LatestPosts() {
  return (
    <Suspense fallback={<LatestPostsLoading />}>
      <LatestPostsContent />
    </Suspense>
  );
}
