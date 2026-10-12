
import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About Me",
  description:
    "Discover the purpose behind Simply Smart Money and our approach to practical personal finance education.",
};

const principles = [
  {
    number: "01",
    title: "Keep money simple",
    description:
      "Financial topics can feel complicated. We break them into clear explanations and practical steps.",
  },
  {
    number: "02",
    title: "Focus on real life",
    description:
      "Our content explores everyday financial decisions, from managing expenses to evaluating ways to earn extra income.",
  },
  {
    number: "03",
    title: "Encourage informed choices",
    description:
      "We help readers understand their options so they can evaluate what makes sense for their own circumstances.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white text-[#14233B]">
        <section className="bg-[#F4F7FC]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3976D8]">
              About Simply Smart Money
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Better money decisions begin with better understanding.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#647188]">
              Practical money tips for everyday life—without unnecessary
              jargon, unrealistic promises, or the pressure to have everything
              figured out at once.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-12 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3976D8]">
              Why we exist
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Personal finance should feel more approachable.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-[#647188]">
              <p>
                Simply Smart Money was created around a simple idea: people
                deserve accessible information that helps them think more
                clearly about money.
              </p>
              <p>
                We cover budgeting, saving, earning money online, side
                hustles, and other topics that can help readers develop
                stronger financial habits.
              </p>
              <p>
                Our goal is not to promise overnight wealth. It is to make
                useful knowledge easier to understand, evaluate, and apply
                thoughtfully in everyday life.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#14233B] p-8 text-white sm:p-10">
            <span className="text-4xl text-[#9DBCF0]">“</span>
            <blockquote className="mt-3 text-2xl font-medium leading-relaxed">
              You don't need to know everything about money. You need the
              knowledge to make your next decision a little smarter.
            </blockquote>
            <p className="mt-6 text-sm text-[#B8C7DD]">
              The philosophy behind Simply Smart Money
            </p>
          </div>
        </section>

        <section className="border-y border-[#E8ECF2] bg-[#FAFBFD]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
            <h2 className="text-3xl font-semibold tracking-tight">
              What you can expect from us
            </h2>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              {principles.map((principle) => (
                <article
                  key={principle.number}
                  className="rounded-2xl border border-[#E4E9F0] bg-white p-6 sm:p-8"
                >
                  <span className="text-sm font-bold text-[#3976D8]">
                    {principle.number}
                  </span>
                  <h3 className="mt-6 text-xl font-semibold">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[#647188]">
                    {principle.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-24">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Let's make your next money decision a smarter one.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#647188]">
            Explore our guides and find practical ideas you can investigate
            at your own pace.
          </p>
          <Link
            href="/blog"
            className="mt-7 inline-flex rounded-full bg-[#14233B] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#263D60]"
          >
            Explore the blog →
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
