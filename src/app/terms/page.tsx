
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms governing your use of Simply Smart Money and its educational content.",
};

const sections = [
  {
    title: "1. Acceptance of these terms",
    paragraphs: [
      "These Terms & Conditions apply to your use of Simply Smart Money. By accessing or using the website, you agree to comply with these terms. If you do not agree, please discontinue use of the website.",
    ],
  },
  {
    title: "2. Educational information only",
    paragraphs: [
      "Our content covers topics such as budgeting, saving, earning money online, side hustles, and personal finance.",
      "Content is provided for general educational and informational purposes only. It is not individualized financial, investment, tax, accounting, or legal advice. Consider your circumstances and consult a suitably qualified professional when necessary.",
    ],
  },
  {
    title: "3. No guarantee of results",
    paragraphs: [
      "Financial outcomes depend on many factors, including individual circumstances, market conditions, skills, and decisions. We do not guarantee earnings, investment returns, business success, or any particular financial outcome.",
      "Examples, projections, and income claims must not be interpreted as promises that you will achieve similar results.",
    ],
  },
  {
    title: "4. Your responsibilities",
    paragraphs: [
      "You agree to use the website lawfully and respectfully. You must not attempt to disrupt its operation, compromise its security, introduce malicious code, or use its content for unlawful purposes.",
      "You are responsible for evaluating information before relying on it and for decisions you make based on material found on this website.",
    ],
  },
  {
    title: "5. Intellectual property",
    paragraphs: [
      "Unless otherwise indicated, website text, branding, graphics, and original materials belong to Simply Smart Money or their respective rights holders and may be protected by intellectual property laws.",
      "You may read, share links to, and refer to our content for personal and lawful purposes. You must not republish substantial portions, sell, or distribute our work without appropriate permission, except where the law allows.",
    ],
  },
  {
    title: "6. Affiliate links and sponsored content",
    paragraphs: [
      "The website may contain affiliate links, advertising, or sponsored material. We may receive compensation if you use certain links or purchase qualifying products. Applicable commercial relationships should be disclosed alongside relevant content.",
      "You should evaluate third-party products and services independently. Your transactions with third parties are subject to their own terms and policies.",
    ],
  },
  {
    title: "7. Third-party websites",
    paragraphs: [
      "Links to external websites are provided for convenience and additional information. We do not control all third-party websites and cannot guarantee their accuracy, availability, security, or practices.",
    ],
  },
  {
    title: "8. Disclaimer and limitation of liability",
    paragraphs: [
      "To the extent permitted by applicable law, the website and its content are provided on an as-available basis without guarantees that information is complete, current, error-free, or suitable for every purpose.",
      "Nothing in these terms excludes or limits liability where such exclusion or limitation is prohibited by law. Any permitted limitation must be interpreted subject to applicable consumer protection and other mandatory legal rights.",
    ],
  },
  {
    title: "9. Changes to the website and terms",
    paragraphs: [
      "We may modify website features, content, or these terms as the publication develops. Changes will be posted on this page with a revised date where appropriate. Continued use after an update is subject to applicable law.",
    ],
  },
  {
    title: "10. Governing law",
    paragraphs: [
      "These terms are subject to applicable laws. Before publication, identify the appropriate governing law and jurisdiction for the website operator, taking account of your location, audience, and legal obligations.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white text-[#14233B]">
        <section className="bg-[#F4F7FC]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3976D8]">
              Website guidelines
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
              Terms & Conditions
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#647188]">
              These terms explain the basic rules for using Simply Smart Money
              and understanding the content we provide.
            </p>
            <p className="mt-4 text-sm text-[#7B8798]">
              Last updated: October 11, 2026
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20 lg:px-12 lg:py-16">
          <aside className="h-fit rounded-2xl bg-[#F4F7FC] p-5 lg:sticky lg:top-24">
            <p className="text-sm font-semibold">On this page</p>
            <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-3 text-sm text-[#526078] lg:flex-col">
              {sections.map((section, index) => (
                <a
                  key={section.title}
                  href={`#terms-${index + 1}`}
                  className="hover:text-[#3976D8]"
                >
                  {section.title.replace(/^\d+\.\s*/, "")}
                </a>
              ))}
            </nav>
          </aside>

          <article className="max-w-3xl">
            <div className="mb-10 rounded-2xl border border-[#E4E9F0] p-5 text-sm leading-7 text-[#647188]">
              <strong className="text-[#14233B]">Before publication:</strong>{" "}
              This is a general starter template, not a substitute for legal
              advice. Review it for your business, location, audience, and
              monetization arrangements before relying on it.
            </div>

            <div className="space-y-10">
              {sections.map((section, index) => (
                <section
                  key={section.title}
                  id={`terms-${index + 1}`}
                  className="scroll-mt-28"
                >
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-sm leading-8 text-[#526078] sm:text-base">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-2xl bg-[#F4F7FC] p-6">
              <h2 className="font-semibold">Need clarification?</h2>
              <p className="mt-2 text-sm leading-7 text-[#647188]">
                Contact us with questions about these terms or how the website
                operates.
              </p>
              <a
                href="/contact"
                className="mt-4 inline-flex text-sm font-semibold text-[#315B9A] hover:underline"
              >
                Contact Simply Smart Money →
              </a>
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
