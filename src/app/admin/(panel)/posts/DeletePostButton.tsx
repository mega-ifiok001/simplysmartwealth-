
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeletePostButtonProps = {
  postId: string;
  postTitle: string;
  postSlug: string;
};

export default function DeletePostButton({
  postId,
  postTitle,
  postSlug,
}: DeletePostButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (isDeleting) return;

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/posts/${encodeURIComponent(postId)}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to delete this blog."
        );
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setIsOpen(true);
        }}
        className="font-semibold text-red-600 transition hover:text-red-800"
      >
        Delete
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isDeleting
            ) {
              setIsOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-blog-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="m19 6-1 14H6L5 6" />
                <path d="M10 11v5" />
                <path d="M14 11v5" />
              </svg>
            </div>

            <h2
              id="delete-blog-title"
              className="mt-4 text-xl font-semibold text-[#14233B]"
            >
              Delete this blog?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#647188]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#14233B]">
                &quot;{postTitle}&quot;
              </span>
              ? This action cannot be undone.
            </p>

            <p className="mt-2 break-all text-xs text-[#647188]">
              /blog/{postSlug}
            </p>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-[#E5EAF1] px-5 py-3 text-sm font-semibold text-[#14233B] transition hover:bg-[#FAFBFD] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Yes, delete blog"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
