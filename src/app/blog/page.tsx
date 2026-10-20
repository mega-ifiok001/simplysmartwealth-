import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import SiteFooter from "../../components/SiteFooter";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

async function BlogContent() {
  await connection();

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
    <main className="min-h-screen overflow-x-hidden bg-white text-[#14233B]">
      {/* ───────────── HEADER ───────────── */}
      <header className="sticky top-0 z-50 border-b border-[#E8ECF2] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8 sm:py-4 lg:px-12">
          <Link href="/" className="text-lg font-semibold tracking-tight">
           <img src="/logo.png" width={170} alt="official logo" />
          </Link>

          {/* Desktop / tablet nav */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 text-sm text-[#526078] md:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.href === "/blog"
                    ? "font-semibold text-[#3976D8]"
                    : "hover:text-[#3976D8]"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile floating hamburger menu */}
          <details className="group relative md:hidden">
            <summary
              aria-label="Toggle navigation menu"
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-[#DCE2EA] bg-white text-xl text-[#14233B] transition hover:bg-[#FAFBFD] active:scale-95 [&::-webkit-details-marker]:hidden"
            >
              <span aria-hidden="true" className="group-open:hidden">
                ☰
              </span>
              <span aria-hidden="true" className="hidden group-open:inline">
                ✕
              </span>
            </summary>

            <nav
              aria-label="Mobile navigation"
              className="absolute right-0 top-14 z-50 w-56 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#E8ECF2] bg-white p-3 shadow-xl shadow-[#14233B]/10"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-[#FAFBFD] hover:text-[#3976D8] ${
                    link.href === "/blog"
                      ? "bg-[#F4F7FC] text-[#3976D8]"
                      : "text-[#526078]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </header>

      {/* ───────────── PAGE HERO ───────────── */}
      <section className="bg-[#F4F7FC]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3976D8]">
            The SimplySmartWealth Journal
          </p>

          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight min-[400px]:text-4xl sm:text-5xl lg:text-6xl">
            Practical money tips for everyday life.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#647188] sm:mt-5 sm:text-lg sm:leading-8">
            Explore straightforward guides to saving, budgeting, earning
            money online, building side hustles, and making more informed
            financial decisions.
          </p>

          <p className="mt-5 text-sm text-[#647188] sm:mt-6">
            {posts.length} {posts.length === 1 ? "article" : "articles"} published
          </p>
        </div>
      </section>

      {/* ───────────── POSTS ───────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#D7DFEA] px-5 py-12 text-center sm:px-6 sm:py-16">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF1FD] text-xl text-[#315B9A] sm:h-14 sm:w-14 sm:text-2xl">
              ✦
            </div>

            <h2 className="mt-5 text-xl font-semibold sm:mt-6 sm:text-2xl">
              Our first articles are on the way.
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#647188] sm:text-base">
              We're preparing practical financial guides to help you make
              smarter decisions with your money. Published articles will
              appear here.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-[#14233B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#263D60] sm:mt-7"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="group min-w-0">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#EAF1FD] to-[#D3E1F7] sm:h-56">
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
                        <span className="text-5xl font-light text-[#315B9A] sm:text-6xl">
                          {post.title.charAt(0).toUpperCase()}
                        </span>
                      </>
                    )}

                    <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#14233B] sm:bottom-4 sm:left-4 sm:py-2">
                      SimplySmartWealth
                    </span>
                  </div>

                  <div className="pt-4 sm:pt-5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-wider text-[#3976D8]">
                      <span>{post.category?.name ?? "Personal Finance"}</span>
                      <span className="text-[#C1C8D2]">•</span>
                      <span className="text-[#7B8798]">
                        {post.readingTime} min read
                      </span>
                    </div>

                    <h2 className="mt-3 break-words text-xl font-semibold leading-snug tracking-tight transition group-hover:text-[#3976D8] sm:mt-4 sm:text-2xl">
                      {post.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#647188]">
                      {post.excerpt}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#315B9A] sm:mt-5">
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
    <main className="min-h-screen bg-white px-4 py-20 text-center text-sm text-[#647188] sm:px-5 sm:py-24 sm:text-base">
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