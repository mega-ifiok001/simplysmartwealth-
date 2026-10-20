"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import LogoutButton from "../LogoutButton";
import Icon from "./Icon";

type AdminShellProps = {
  admin: { name: string; email: string; role: string };
  today: string;
  children: ReactNode;
};

export default function AdminShell({ admin, today, children }: AdminShellProps) {
  const pathname = usePathname();

 
const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "grid",
    active: pathname === "/admin",
  },
  {
    label: "Blogs",
    href: "/admin/posts",
    icon: "file",
    active:
      pathname.startsWith("/admin/posts") && pathname !== "/admin/posts/new",
  },
  {
    label: "New blog",
    href: "/admin/posts/new",
    icon: "plus",
    active: pathname === "/admin/posts/new",
  },
  {
    label: "Contact Messages",
    href: "/admin/contact",
    icon: "file",
    active: pathname === "/admin/contact",
  },
  {
    label: "Live blog page",
    href: "/blog",
    icon: "external",
    active: false,
  },
];


  const pageTitle = navItems.find((item) => item.active)?.label ?? "Admin";
  const roleLabel = admin.role === "ADMIN" ? "Administrator" : "Editor";

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-[#14233B]">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#E5EAF1] bg-white lg:flex">
        <div className="border-b border-[#E5EAF1] px-6 py-5">
          <Link href="/" className="text-lg font-bold tracking-tight">
           <img src="/logo.png" alt="official logo"  />
          </Link>
          <span className="mt-2 inline-block rounded-full bg-[#EAF1FD] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#315B9A]">
            Admin
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Admin navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                item.active
                  ? "bg-[#14233B] text-white"
                  : "text-[#526078] hover:bg-[#F4F6FA] hover:text-[#14233B]"
              }`}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#E5EAF1] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF1FD] text-sm font-semibold text-[#315B9A]">
              {admin.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{admin.name}</p>
              <p className="truncate text-xs text-[#647188]">{roleLabel}</p>
            </div>
          </div>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-[#E5EAF1] bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <div>
              <p className="text-lg font-semibold tracking-tight">{pageTitle}</p>
              <p className="text-xs text-[#647188]">{today}</p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/posts/new"
                className="hidden items-center gap-2 rounded-xl bg-[#14233B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#263D60] sm:inline-flex"
              >
                <Icon name="plus" className="h-4 w-4" />
                Create blog
              </Link>
              <div className="lg:hidden">
                <LogoutButton />
              </div>
            </div>
          </div>

          {/* Mobile nav */}
          <nav
            className="flex gap-2 overflow-x-auto border-t border-[#E5EAF1] px-5 py-3 lg:hidden"
            aria-label="Admin navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  item.active
                    ? "bg-[#14233B] text-white"
                    : "bg-[#F4F6FA] text-[#526078]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}