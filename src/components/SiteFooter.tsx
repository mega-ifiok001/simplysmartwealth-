
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#E8ECF2] bg-[#FAFBFD]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-[#14233B]"
            >
              Simply Smart Money
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-7 text-[#647188]">
              Practical money tips for everyday life. Learn about saving,
              budgeting, online income, and building better financial habits.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#14233B]">
              Explore
            </h2>
            <nav className="mt-4 flex flex-col items-start gap-3 text-sm text-[#647188]">
              <Link href="/" className="hover:text-[#3976D8]">Home</Link>
              <Link href="/blog" className="hover:text-[#3976D8]">Blog</Link>
              <Link href="/about" className="hover:text-[#3976D8]">About Me</Link>
              <Link href="/contact" className="hover:text-[#3976D8]">Contact</Link>
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#14233B]">
              Information
            </h2>
            <nav className="mt-4 flex flex-col items-start gap-3 text-sm text-[#647188]">
              <Link href="/privacy-policy" className="hover:text-[#3976D8]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#3976D8]">
                Terms & Conditions
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#E8ECF2] pt-6 text-xs leading-6 text-[#7B8798] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Simply Smart Money. All rights reserved.
          </p>
          <p>
            Educational content only—not individualized financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
