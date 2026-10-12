
import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import SiteFooter from '../../components/SiteFooter'


async function BlogContent() {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: [
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <main className="min-h-screen bg-white text-[#14233B]">
      <header className="border-b border-[#E8ECF2]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Simply Smart Money
          </Link>

          <nav className="flex flex-wrap items-center gap-4 text-sm text-[#526078] sm:gap-6">
            <Link href="/" className="hover:text-[#3976D8]">
              Home
            </Link>
            <Link href="/blog" className="font-semibold text-[#3976D8]">
              Blog
            </Link>
            <Link href="/about" className="hover:text-[#3976D8]">
              About
            </Link>
            <Link href="/contact" className="hover:text-[#3976D8]">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-[#F4F7FC]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3976D8]">
            The Simply Smart Money Journal
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Practical money tips for everyday life.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-[#647188] sm:text-lg">
            Explore straightforward guides to saving, budgeting, earning
            money online, building side hustles, and making more informed
            financial decisions.
          </p>

          <p className="mt-6 text-sm text-[#647188]">
            {posts.length} {posts.length === 1 ? "article" : "articles"} published
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#D7DFEA] px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF1FD] text-2xl text-[#315B9A]">
              ✦
            </div>

            <h2 className="mt-6 text-2xl font-semibold">
              Our first articles are on the way.
            </h2>

            <p className="mx-auto mt-3 max-w-lg leading-7 text-[#647188]">
              We're preparing practical financial guides to help you make
              smarter decisions with your money. Published articles will
              appear here.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-full bg-[#14233B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#263D60]"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="group min-w-0">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#EAF1FD] to-[#D3E1F7]">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <>
                        <span className="absolute -right-8 -top-12 h-48 w-48 rounded-full border border-[#315B9A]/15" />
                        <span className="absolute -right-2 -top-6 h-36 w-36 rounded-full border border-[#315B9A]/15" />
                        <span className="text-6xl font-light text-[#315B9A]">
                          {post.title.charAt(0).toUpperCase()}
                        </span>
                      </>
                    )}

                    <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#14233B]">
                      Simply Smart Money
                    </span>
                  </div>

                  <div className="pt-5">
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-[#3976D8]">
                      <span>{post.category?.name ?? "Personal Finance"}</span>
                      <span className="text-[#C1C8D2]">•</span>
                      <span className="text-[#7B8798]">
                        {post.readingTime} min read
                      </span>
                    </div>

                    <h2 className="mt-4 text-xl font-semibold leading-snug tracking-tight transition group-hover:text-[#3976D8] sm:text-2xl">
                      {post.title}
                    </h2>

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
        )}
      </section>

           <SiteFooter />
     
    </main>
  );
}

function BlogLoading() {
  return (
    <main className="min-h-screen bg-white px-5 py-24 text-center text-[#647188]">
      Loading articles...
    </main>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<BlogLoading />}>
      <BlogContent />
    </Suspense>
  );
}
