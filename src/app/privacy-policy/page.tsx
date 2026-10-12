
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Simply Smart Money may collect, use, and protect personal information.",
};

const sections = [
  {
    title: "1. Information we may collect",
    paragraphs: [
      "Depending on the features you use, we may collect information you voluntarily provide, such as your name and email address when you contact us or subscribe to a newsletter.",
      "Basic technical information, such as browser type, device information, pages visited, and approximate usage data, may also be collected if analytics or similar technologies are enabled.",
    ],
  },
  {
    title: "2. How information may be used",
    paragraphs: [
      "Information may be used to respond to enquiries, deliver newsletters you request, maintain and improve the website, understand which content is useful, protect the site from misuse, and meet applicable legal obligations.",
      "We do not ask you to submit bank passwords, payment card details, or other confidential financial credentials through this website.",
    ],
  },
  {
    title: "3. Cookies and analytics",
    paragraphs: [
      "The website may use cookies or similar technologies to support essential functionality, measure traffic, remember preferences, or support advertising, where those services are enabled.",
      "You can manage cookies through your browser settings. Some features may not work as expected if certain cookies are disabled. If analytics or advertising tools are added, this policy should identify those providers and explain their relevant practices.",
    ],
  },
  {
    title: "4. Newsletters and communications",
    paragraphs: [
      "If newsletter subscriptions are enabled, we may use your email address to send the updates you requested. You should be able to unsubscribe using the instructions provided in those messages.",
      "We will not describe a newsletter as active or promise a particular email frequency until the subscription service is operational and its practices have been confirmed.",
    ],
  },
  {
    title: "5. Third-party services and links",
    paragraphs: [
      "Our website may link to external websites or use third-party services, such as hosting, analytics, newsletter delivery, advertising, and affiliate programmes. Those providers may process information under their own privacy policies.",
      "We are not responsible for the privacy practices of external websites. Please review their policies before providing personal information.",
    ],
  },
  {
    title: "6. Affiliate links and advertising",
    paragraphs: [
      "Simply Smart Money may earn a commission when readers purchase through qualifying affiliate links, at no additional cost to the reader where applicable. Sponsored content and paid partnerships should be identified clearly.",
      "Advertising partners, if enabled, may use cookies or similar technologies subject to applicable law and their own policies. Commercial relationships should not be presented as independent endorsements.",
    ],
  },
  {
    title: "7. Data retention and security",
    paragraphs: [
      "We aim to retain personal information only for as long as reasonably necessary for the purposes described in this policy or as required by law. Retention periods depend on the type of information and the reason it was collected.",
      "Reasonable safeguards should be used to protect information. However, no internet transmission or storage system can be guaranteed to be completely secure.",
    ],
  },
  {
    title: "8. Your privacy rights",
    paragraphs: [
      "Depending on your location and applicable law, you may have rights to request access to, correction of, deletion of, or restrictions on the use of your personal information, or to withdraw consent where processing is based on consent.",
      "To make a privacy-related request, contact us using the details on our Contact page. We may need to verify your request before acting on it.",
    ],
  },
  {
    title: "9. Children's privacy",
    paragraphs: [
      "This website is intended for a general audience and is not specifically directed at children. Please contact us if you believe a child has provided personal information inappropriately.",
    ],
  },
  {
    title: "10. Changes to this policy",
    paragraphs: [
      "We may update this policy as the website and its services evolve. Updates will be posted on this page with a revised date.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white text-[#14233B]">
        <section className="bg-[#F4F7FC]">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3976D8]">
              Your information matters
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#647188]">
              This page explains how personal information may be handled when
              you visit or interact with Simply Smart Money.
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
                  href={`#privacy-${index + 1}`}
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
              This is a starter policy. Review it against the actual services
              you operate, the data you collect, your audience locations, and
              applicable privacy laws. Remove or revise any statement that
              does not match your practices.
            </div>

            <div className="space-y-10">
              {sections.map((section, index) => (
                <section
                  key={section.title}
                  id={`privacy-${index + 1}`}
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
              <h2 className="font-semibold">Questions about your privacy?</h2>
              <p className="mt-2 text-sm leading-7 text-[#647188]">
                Contact us if you have a question about this policy or a
                request concerning your personal information.
              </p>
              <a
                href="/contact"
                className="mt-4 inline-flex text-sm font-semibold text-[#315B9A] hover:underline"
              >
                Visit our Contact page →
              </a>
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
