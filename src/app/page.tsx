import Link from "next/link";
import { Suspense } from "react";
import LatestPosts from "../components/LatestPosts";
import SiteFooter from "../components/SiteFooter";
import NewsletterForm from "../components/NewsLetterForm";

const topics = [
  {
    number: "01",
    title: "Saving Money",
    description: "Build better saving habits and make your money go further.",
    href: "/blog?category=saving-money",
  },
  {
    number: "02",
    title: "Budgeting",
    description: "Take control of your income, spending, and financial goals.",
    href: "/blog?category=budgeting",
  },
  {
    number: "03",
    title: "Making Money Online",
    description: "Explore practical ways to earn online and develop useful skills.",
    href: "/blog?category=making-money-online",
  },
  {
    number: "04",
    title: "Side Hustles",
    description: "Discover extra-income ideas you can work on alongside your main job.",
    href: "/blog?category=side-hustles",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#14233B]">
      {/* ───────────── HEADER ───────────── */}
      <header className="sticky top-0 z-50 border-b border-[#E8ECF2] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-8 sm:py-4 lg:px-12">
          <Link
            href="/"
            aria-label="Simply Smart Money homepage"
            className="group flex shrink-0 items-center"
          >
            <img
              src="/logo.png"
              alt="Simply Smart Money logo"
              className="h-auto w-32 sm:w-40 lg:w-48"
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-5 text-sm font-medium text-[#526078] md:flex lg:gap-7"
          >
            <Link href="/blog" className="transition-colors hover:text-[#3976D8]">Blog</Link>
            <Link href="#topics" className="transition-colors hover:text-[#3976D8]">Topics</Link>
            <Link href="/about" className="transition-colors hover:text-[#3976D8]">About</Link>
            <Link href="/contact" className="transition-colors hover:text-[#3976D8]">Contact</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hidden on very small phones so the header never overflows */}
            <Link
              href="#newsletter"
              className="hidden whitespace-nowrap rounded-full bg-[#14233B] px-4 py-2.5 text-xs font-medium text-white transition duration-300 hover:bg-[#263D60] min-[420px]:inline-flex sm:text-sm md:hidden"
            >
              Join the newsletter <span aria-hidden="true" className="ml-1">↗</span>
            </Link>

            <details className="relative md:hidden">
              <summary
                aria-label="Open mobile navigation"
                className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-[#DCE2EA] text-xl transition hover:bg-[#FAFBFD] sm:h-11 sm:w-11 [&::-webkit-details-marker]:hidden"
              >
                ☰
              </summary>
              <nav
                aria-label="Mobile navigation"
                className="absolute right-0 top-14 z-50 w-56 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#E8ECF2] bg-white p-3 shadow-xl shadow-[#14233B]/10"
              >
                {[
                  ["Home", "/"],
                  ["Blog", "/blog"],
                  ["Topics", "#topics"],
                  ["About", "/about"],
                  ["Contact", "/contact"],
                  ["Newsletter", "#newsletter"],
                ].map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-[#526078] transition hover:bg-[#FAFBFD] hover:text-[#3976D8]"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>

      {/* ───────────── HERO ───────────── */}
      <section className="hero-cinematic">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-8 lg:px-12 lg:py-24">
          <div className="relative z-10">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DCE6F7] bg-white/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#315B9A] sm:mb-6 sm:px-4 sm:text-xs sm:tracking-[0.16em]">
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#3976D8]" />
              Personal finance, made clearer
            </p>

            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.1] tracking-[-0.05em] min-[400px]:text-5xl sm:text-6xl lg:text-7xl">
              Make your money work{" "}
              <span className="text-[#3976D8]">smarter.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#647188] sm:mt-7 sm:text-lg sm:leading-8">
              Practical guidance on saving, budgeting, making money online,
              and building better financial habits—one decision at a time.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4">
              <Link
                href="/blog"
                className="group rounded-full bg-[#14233B] px-7 py-4 text-center text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#263D60] hover:shadow-xl hover:shadow-[#14233B]/15"
              >
                Explore the blog{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
              <Link
                href="#topics"
                className="rounded-full border border-[#DCE2EA] bg-white/70 px-7 py-4 text-center text-sm font-semibold transition duration-300 hover:-translate-y-1 hover:border-[#3976D8] hover:bg-white"
              >
                Discover topics
              </Link>
            </div>

            <div className="mt-8 border-t border-[#DCE2EA] pt-5 sm:mt-10 sm:pt-6">
              <p className="text-sm leading-6 text-[#647188]">
                Clear explanations. Practical ideas. More confident financial decisions.
              </p>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto flex min-h-[300px] w-full max-w-xl items-center justify-center sm:min-h-[450px]">
            <div className="hero-orbit" />
            <div className="hero-orbit hero-float-delayed !w-[62%]" />

            <div className="hero-coin relative z-10 flex h-36 w-36 items-center justify-center transition duration-500 hover:scale-105 sm:h-52 sm:w-52 lg:h-56 lg:w-56">
              <span className="hero-coin-symbol">$</span>
            </div>

            <div className="hero-float absolute left-[6%] top-[14%] flex h-12 w-12 items-center justify-center rounded-2xl border border-white bg-white/90 text-xl text-[#315B9A] shadow-xl shadow-[#14233B]/10 transition duration-300 hover:scale-110 hover:shadow-2xl sm:left-[12%] sm:top-[20%] sm:h-20 sm:w-20 sm:text-2xl">
              ↗
            </div>

            <div className="hero-float-delayed absolute bottom-[22%] right-[5%] flex h-14 w-14 items-center justify-center rounded-2xl border border-white bg-white/90 text-2xl text-[#315B9A] shadow-xl shadow-[#14233B]/10 transition duration-300 hover:scale-110 hover:shadow-2xl sm:bottom-[17%] sm:right-[8%] sm:h-24 sm:w-24 sm:text-3xl">
              %
            </div>

            <div className="absolute bottom-[2%] left-[4%] rounded-2xl border border-[#E0E7F1] bg-white/90 px-3 py-2 shadow-lg shadow-[#14233B]/5 backdrop-blur transition duration-300 hover:-translate-y-1 sm:bottom-[5%] sm:left-[13%] sm:px-4 sm:py-3">
              <p className="text-[11px] text-[#647188] sm:text-xs">Your financial journey</p>
              <p className="mt-0.5 text-xs font-semibold sm:mt-1 sm:text-sm">Starts with knowledge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── TOPICS ───────────── */}
      <section id="topics" className="scroll-mt-20 border-y border-[#E8ECF2] bg-[#FAFBFD] sm:scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="mb-8 sm:mb-9">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3976D8]">
              Explore your interests
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Better money habits start here.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#647188] sm:mt-4 sm:text-base">
              Explore practical topics that help you make more informed decisions about your financial life.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((topic) => (
              <Link
                href={topic.href}
                key={topic.number}
                className="group rounded-2xl border border-[#E4E9F0] bg-white p-5 transition duration-300 hover:-translate-y-2 hover:border-[#C6D6EF] hover:shadow-xl hover:shadow-[#14233B]/8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3976D8] sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.15em] text-[#3976D8]">{topic.number}</span>
                  <span className="text-xl text-[#8A96A8] transition duration-300 group-hover:translate-x-1 group-hover:text-[#3976D8]">→</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold transition-colors group-hover:text-[#315B9A] sm:mt-8">
                  {topic.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#647188]">{topic.description}</p>
                {/* Always visible on touch screens, hover-reveal on desktop */}
                <span className="mt-4 inline-block text-sm font-medium text-[#3976D8] transition duration-300 sm:mt-5 lg:opacity-0 lg:group-hover:translate-x-1 lg:group-hover:opacity-100">
                  Explore articles →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── LATEST POSTS ───────────── */}
      <section id="latest" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:scroll-mt-24 sm:px-8 sm:py-16 lg:px-12 lg:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3976D8]">
              From the reading room
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Ideas for your financial life.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#647188] sm:mt-4 sm:text-base">
              Accessible guides to help you understand money, explore opportunities, and develop stronger financial habits.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-[#315B9A] transition hover:translate-x-1 hover:text-[#3976D8]"
          >
            Visit the blog →
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7" aria-label="Loading articles">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl bg-[#FAFBFD] sm:h-72"
                />
              ))}
            </div>
          }
        >
          <LatestPosts />
        </Suspense>
      </section>

      {/* ───────────── ABOUT ───────────── */}
      <section id="about" className="scroll-mt-20 bg-[#14233B] text-white sm:scroll-mt-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-12 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9DBCF0]">
              Our philosophy
            </p>
            <h2 className="mt-4 max-w-xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
              Financial knowledge should be accessible to everyone.
            </h2>
          </div>
          <div>
            <p className="text-sm leading-7 text-[#D1D9E6] sm:text-base sm:leading-8">
              Simply Smart Money is dedicated to making personal finance easier to understand. We share practical educational content about budgeting, saving, online income, and building a stronger financial foundation. Our aim is to help readers ask better questions and make decisions that suit their own circumstances.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex rounded-full border border-white/30 px-5 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
            >
              More about us →
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── NEWSLETTER ───────────── */}
      <section
        id="newsletter"
        className="mx-auto max-w-4xl scroll-mt-20 px-4 py-14 text-center sm:scroll-mt-24 sm:px-8 sm:py-20 lg:py-24"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF1FD] text-xl text-[#315B9A] sm:h-14 sm:w-14 sm:text-2xl">
          ✉
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#3976D8] sm:mt-6">
          The smarter money letter
        </p>

        <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight min-[400px]:text-3xl sm:text-4xl lg:text-5xl">
          Make room for smarter money decisions.
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#647188] sm:mt-5 sm:text-base">
          Stay informed with practical financial insights and new educational articles.
        </p>

        <NewsletterForm />
      </section>

      <SiteFooter />
    </main>
  );
}