import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import AdminShell from "./AdminShell";

async function ShellWithSession({ children }: { children: ReactNode }) {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  const today = new Intl.DateTimeFormat("en", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <AdminShell
      admin={{ name: admin.name, email: admin.email, role: String(admin.role) }}
      today={today}
    >
      {children}
    </AdminShell>
  );
}

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F6FA]" />}>
      <ShellWithSession>{children}</ShellWithSession>
    </Suspense>
  );
}