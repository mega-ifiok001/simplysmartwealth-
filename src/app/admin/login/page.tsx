
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const admin = await getAdminSession();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFBFD] px-5 py-12">
      <section className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#315B9A] transition hover:text-[#3976D8]"
        >
          <span aria-hidden="true">←</span> Back to Simply Smart Money
        </Link>

        <div className="mt-8 rounded-3xl border border-[#E5EAF1] bg-white p-7 shadow-sm sm:p-9">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF1FD] text-xl font-bold text-[#315B9A]">
            S
          </div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#3976D8]">
            Private administrator access
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#14233B]">
            Welcome back.
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#647188]">
            Sign in to manage your blogs and publication.
          </p>

          <LoginForm />

          <p className="mt-6 text-center text-xs leading-6 text-[#7B8798]">
            This area is restricted to authorised team members.
          </p>
        </div>
      </section>
    </main>
  );
}
