
import Link from "next/link";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E8ECF2] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14233B] text-lg font-bold text-white">
            S
          </span>
          <span className="text-base font-bold tracking-tight sm:text-lg">
            Simply Smart Money
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="flex items-center gap-3 text-sm font-medium text-[#526078] sm:gap-6"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[#3976D8]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
