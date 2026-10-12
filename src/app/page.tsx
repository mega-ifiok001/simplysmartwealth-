
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
    <main className="min-h-screen overflow-hidden bg-white text-[#14233B]">
      <header className="sticky top-0 z-50 border-b border-[#E8ECF2] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
          <Link
            href="/"
            aria-label="Simply Smart Money homepage"
            className="group flex shrink-0 items-center gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14233B] text-lg font-semibold text-white transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
              S
            </span>
            <span className="text-lg font-semibold tracking-tight sm:text-xl">
              Simply Smart Money
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 text-sm font-medium text-[#526078] md:flex"
          >
            <Link href="/blog" className="transition-colors hover:text-[#3976D8]">Blog</Link>
            <Link href="#topics" className="transition-colors hover:text-[#3976D8]">Topics</Link>
            <Link href="/about" className="transition-colors hover:text-[#3976D8]">About</Link>
            <Link href="/contact" className="transition-colors hover:text-[#3976D8]">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="#newsletter"
              className="rounded-full bg-[#14233B] px-4 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#263D60] hover:shadow-lg hover:shadow-[#14233B]/15 sm:px-5"
            >
              Join the newsletter <span aria-hidden="true">↗</span>
            </Link>

            <details className="relative md:hidden">
              <summary
                aria-label="Open mobile navigation"
                className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-[#DCE2EA] text-xl transition hover:bg-[#FAFBFD] [&::-webkit-details-marker]:hidden"
              >
                ☰
              </summary>
              <nav
                aria-label="Mobile navigation"
                className="absolute right-0 top-14 z-50 w-56 rounded-2xl border border-[#E8ECF2] bg-white p-3 shadow-xl shadow-[#14233B]/10"
              >
                {[
                  ["Home", "/"],
                  ["Blog", "/blog"],
                  ["Topics", "#topics"],
                  ["About", "/about"],
                  ["Contact", "/contact"],
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

      <section className="hero-cinematic">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-8 lg:px-12 lg:py-24">
          <div className="relative z-10">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#DCE6F7] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#315B9A]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#3976D8]" />
              Personal finance, made clearer
            </p>

            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Make your money work{" "}
              <span className="text-[#3976D8]">smarter.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#647188]">
              Practical guidance on saving, budgeting, making money online,
              and building better financial habits—one decision at a time.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/blog"
                className="group rounded-full bg-[#14233B] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-[#263D60] hover:shadow-xl hover:shadow-[#14233B]/15"
              >
                Explore the blog{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
              <Link
                href="#topics"
                className="rounded-full border border-[#DCE2EA] bg-white/70 px-7 py-4 text-sm font-semibold transition duration-300 hover:-translate-y-1 hover:border-[#3976D8] hover:bg-white"
              >
                Discover topics
              </Link>
            </div>

            <div className="mt-10 border-t border-[#DCE2EA] pt-6">
              <p className="text-sm leading-6 text-[#647188]">
                Clear explanations. Practical ideas. More confident financial decisions.
              </p>
            </div>
          </div>

          <div className="relative mx-auto flex min-h-[360px] w-full max-w-xl items-center justify-center sm:min-h-[450px]">
            <div className="hero-orbit" />
            <div className="hero-orbit hero-float-delayed !w-[62%]" />

            <div className="hero-coin relative z-10 flex h-44 w-44 items-center justify-center transition duration-500 hover:scale-105 sm:h-56 sm:w-56">
              <span className="hero-coin-symbol">$</span>
            </div>

            <div className="hero-float absolute left-[10%] top-[20%] flex h-16 w-16 items-center justify-center rounded-2xl border border-white bg-white/90 text-2xl text-[#315B9A] shadow-xl shadow-[#14233B]/10 transition duration-300 hover:scale-110 hover:shadow-2xl sm:left-[12%] sm:h-20 sm:w-20">
              ↗
            </div>

            <div className="hero-float-delayed absolute bottom-[17%] right-[8%] flex h-20 w-20 items-center justify-center rounded-2xl border border-white bg-white/90 text-3xl text-[#315B9A] shadow-xl shadow-[#14233B]/10 transition duration-300 hover:scale-110 hover:shadow-2xl sm:h-24 sm:w-24">
              %
            </div>

            <div className="absolute bottom-[5%] left-[13%] rounded-2xl border border-[#E0E7F1] bg-white/90 px-4 py-3 shadow-lg shadow-[#14233B]/5 backdrop-blur transition duration-300 hover:-translate-y-1">
              <p className="text-xs text-[#647188]">Your financial journey</p>
              <p className="mt-1 text-sm font-semibold">Starts with knowledge.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="topics" className="scroll-mt-24 border-y border-[#E8ECF2] bg-[#FAFBFD]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="mb-9">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3976D8]">
              Explore your interests
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Better money habits start here.
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-[#647188]">
              Explore practical topics that help you make more informed decisions about your financial life.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((topic) => (
              <Link
                href={topic.href}
                key={topic.number}
                className="group rounded-2xl border border-[#E4E9F0] bg-white p-6 transition duration-300 hover:-translate-y-2 hover:border-[#C6D6EF] hover:shadow-xl hover:shadow-[#14233B]/8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3976D8]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.15em] text-[#3976D8]">{topic.number}</span>
                  <span className="text-xl text-[#8A96A8] transition duration-300 group-hover:translate-x-1 group-hover:text-[#3976D8]">→</span>
                </div>
                <h3 className="mt-8 text-lg font-semibold transition-colors group-hover:text-[#315B9A]">
                  {topic.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#647188]">{topic.description}</p>
                <span className="mt-5 inline-block text-sm font-medium text-[#3976D8] opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  Explore articles →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="latest" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3976D8]">
              From the reading room
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Ideas for your financial life.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-[#647188]">
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
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading articles">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-72 animate-pulse rounded-2xl bg-[#FAFBFD]"
                />
              ))}
            </div>
          }
        >
          <LatestPosts />
        </Suspense>
      </section>

      <section id="about" className="scroll-mt-24 bg-[#14233B] text-white">
        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:px-12 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9DBCF0]">
              Our philosophy
            </p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Financial knowledge should be accessible to everyone.
            </h2>
          </div>
          <div>
            <p className="text-base leading-8 text-[#D1D9E6]">
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

     
<section id="newsletter" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-20 text-center sm:px-8 sm:py-24">
  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF1FD] text-2xl text-[#315B9A]">
    ✉
  </div>

  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#3976D8]">
    The smarter money letter
  </p>

  <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
    Make room for smarter money decisions.
  </h2>

  <p className="mx-auto mt-5 max-w-xl leading-7 text-[#647188]">
    Stay informed with practical financial insights and new educational articles.
  </p>

  <NewsletterForm />
</section>


      <SiteFooter />
    </main>
  );
}
