"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");


 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSent(false);
    setError("");
    setSending(true);

    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? "General enquiry"),
      message: String(data.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send your message.");
      }

      form.reset();
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  }


  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-white text-[#14233B]">
        <section className="bg-[#F4F7FC]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3976D8]">
              Get in touch
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Have a question or an idea to share?
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#647188]">
              We'd love to hear from readers, potential collaborators, and
              businesses interested in working with Simply Smart Money.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-12 lg:py-20">
          <aside>
            <h2 className="text-2xl font-semibold">Let's start a conversation.</h2>
            <p className="mt-4 leading-7 text-[#647188]">
              Whether you have feedback on an article, a partnership proposal,
              or a general question, choose the option that best fits your
              enquiry.
            </p>

            <div className="mt-8 rounded-2xl border border-[#E4E9F0] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF1FD] text-xl text-[#315B9A]">
                ✉
              </div>
              <h3 className="mt-4 font-semibold">Email us</h3>
              <a
                href="mailto:hello@simplysmartwealth.com"
                className="mt-2 inline-block break-all text-sm text-[#3976D8] hover:underline"
              >
                hello@simplysmartwealth.com
              </a>
              <p className="mt-3 text-sm leading-6 text-[#647188]">
                Replace this address with your confirmed, working inbox before
                launching the site.
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-[#F4F7FC] p-6">
              <h3 className="font-semibold">A quick note</h3>
              <p className="mt-2 text-sm leading-7 text-[#647188]">
                We provide general educational information, not personal
                financial advice. Please don't include passwords, payment
                details, or other sensitive information in your message.
              </p>
            </div>
          </aside>

          <div className="rounded-3xl border border-[#E4E9F0] p-6 shadow-sm shadow-[#14233B]/5 sm:p-9">
            <h2 className="text-2xl font-semibold">Send us a message</h2>
          <p className="mt-2 text-sm leading-6 text-[#647188]">
  Complete the form below and we'll receive your message directly.
</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-[#DCE2EA] bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#9AA4B2] focus:border-[#3976D8] focus:ring-4 focus:ring-[#3976D8]/10"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#DCE2EA] bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-[#9AA4B2] focus:border-[#3976D8] focus:ring-4 focus:ring-[#3976D8]/10"
                />
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                  What is this about?
                </label>
                <select
                  id="subject"
                  name="subject"
                  defaultValue="General enquiry"
                  className="w-full rounded-xl border border-[#DCE2EA] bg-white px-4 py-3.5 text-sm outline-none focus:border-[#3976D8] focus:ring-4 focus:ring-[#3976D8]/10"
                >
                  <option>General enquiry</option>
                  <option>Article feedback</option>
                  <option>Partnership opportunity</option>
                  <option>Advertising enquiry</option>
                  <option>Technical issue</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium">
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={6}
                  placeholder="How can we help?"
                  className="w-full resize-y rounded-xl border border-[#DCE2EA] bg-white px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-[#9AA4B2] focus:border-[#3976D8] focus:ring-4 focus:ring-[#3976D8]/10"
                />
                <p className="mt-2 text-xs text-[#7B8798]">
                  Please don't include confidential financial information.
                </p>
              </div>

             
<button
  type="submit"
  disabled={sending}
  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#14233B] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#263D60] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-[#3976D8]/20"
>
  {sending ? "Sending message..." : "Send message"}
  {!sending && <span aria-hidden="true">→</span>}
</button>


{sent && (
  <p role="status" className="text-sm leading-6 text-green-700">
    Thank you for contacting us. Your message has been received successfully.
  </p>
)}

{error && (
  <p role="alert" className="text-sm leading-6 text-red-600">
    {error}
  </p>
)}

            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
