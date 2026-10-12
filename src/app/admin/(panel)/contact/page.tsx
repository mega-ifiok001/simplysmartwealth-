
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";



type ContactPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function AdminContactPage({
  searchParams,
}: ContactPageProps) {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await searchParams;

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const selectedMessage = id
    ? messages.find((message) => message.id === id)
    : null;

  const unreadCount = messages.filter(
    (message) => !message.isRead
  ).length;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#d9532a]">
            SimplySmartWealth
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Contact messages
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Read and respond to messages sent through your website.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">Unread messages</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {unreadCount}
          </p>
        </div>
      </div>

      {selectedMessage && (
        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">
                {selectedMessage.subject}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-gray-900">
                {selectedMessage.name}
              </h2>
              <a
                href={`mailto:${encodeURIComponent(selectedMessage.email)}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}`}
                className="mt-1 inline-block break-all text-sm text-blue-600 hover:underline"
              >
                {selectedMessage.email}
              </a>
            </div>

            <Link
              href="/admin/contact"
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close message
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-500">
            Received{" "}
            {selectedMessage.createdAt.toLocaleString()}
          </p>

          <div className="mt-6 whitespace-pre-wrap break-words rounded-xl bg-gray-50 p-5 text-sm leading-7 text-gray-700">
            {selectedMessage.message}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`mailto:${encodeURIComponent(selectedMessage.email)}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}`}
              className="rounded-full bg-[#14233B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#263D60]"
            >
              Reply by email
            </a>

            {!selectedMessage.isRead && (
              <form action="/api/admin/contact" method="POST">
                <input
                  type="hidden"
                  name="id"
                  value={selectedMessage.id}
                />
                <input
                  type="hidden"
                  name="action"
                  value="read"
                />
              
              </form>
            )}
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Recent enquiries
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Showing up to 100 of your latest messages.
          </p>
        </div>

        {messages.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="font-semibold text-gray-900">
              No messages yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Messages submitted through your contact form will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((message) => (
              <Link
                key={message.id}
                href={`/admin/contact?id=${encodeURIComponent(message.id)}`}
                className="flex flex-col gap-3 px-5 py-5 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {message.name}
                    </span>

                    {!message.isRead && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        Unread
                      </span>
                    )}
                  </div>

                  <p className="mt-1 break-all text-sm text-gray-500">
                    {message.email}
                  </p>

                  <p className="mt-2 text-sm font-medium text-gray-800">
                    {message.subject}
                  </p>

                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">
                    {message.message}
                  </p>
                </div>

                <time className="shrink-0 text-xs text-gray-500">
                  {message.createdAt.toLocaleDateString()}
                </time>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
