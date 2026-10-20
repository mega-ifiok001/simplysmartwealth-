import Link from "next/link";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E8ECF2] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8 sm:py-4 lg:px-12">
        <Link
          href="/"
          aria-label="Simply Smart Money homepage"
          className="flex shrink-0 items-center"
        >
          <img
            src="/logo.png"
            alt="Simply Smart Money logo"
            className="h-auto w-32 sm:w-40 lg:w-48"
          />
        </Link>

        {/* Desktop / tablet nav */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 text-sm font-medium text-[#526078] md:flex lg:gap-7"
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
            {[{ href: "/", label: "Home" }, ...links].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-[#526078] transition hover:bg-[#FAFBFD] hover:text-[#3976D8]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}