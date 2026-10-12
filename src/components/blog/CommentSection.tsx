"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CommentItem = {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  replies: {
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
  }[];
};

type CommentSectionProps = {
  postSlug: string;
  comments: CommentItem[];
};

export default function CommentSection({
  postSlug,
  comments,
}: CommentSectionProps) {
  const router = useRouter();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function submitComment(parentId?: string) {
    if (submitting) return;

    setError("");
    setNotice("");

    if (authorName.trim().length < 2) {
      setError("Please enter your name (at least 2 characters).");
      return;
    }

    if (content.trim().length < 3) {
      setError("Please write a little more before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `/api/blog/${encodeURIComponent(postSlug)}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authorName: authorName.trim(),
            authorEmail: authorEmail.trim(),
            content: content.trim(),
            ...(parentId ? { parentId } : {}),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to submit your comment.");
      }

      setAuthorName("");
      setAuthorEmail("");
      setContent("");
      setReplyingTo(null);
      setNotice(
        "Thank you for joining the conversation! Your comment is now live."
      );

      // Re-fetch the server component so the new comment appears
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function renderCommentForm(parentId?: string) {
    return (
      <form
        className="mt-5 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submitComment(parentId);
        }}
      >
        <div>
          <label
            htmlFor={`comment-name-${parentId ?? "new"}`}
            className="mb-2 block text-sm font-medium text-[#14233B]"
          >
            Your name
          </label>
          <input
            id={`comment-name-${parentId ?? "new"}`}
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            required
            minLength={2}
            maxLength={60}
            autoComplete="name"
            className="w-full rounded-xl border border-[#E1E7F0] bg-white px-4 py-3 text-sm text-[#14233B] outline-none transition focus:border-[#3976D8] focus:ring-2 focus:ring-[#3976D8]/15"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label
            htmlFor={`comment-email-${parentId ?? "new"}`}
            className="mb-2 block text-sm font-medium text-[#14233B]"
          >
            Email address (optional)
          </label>
          <input
            id={`comment-email-${parentId ?? "new"}`}
            type="email"
            value={authorEmail}
            onChange={(event) => setAuthorEmail(event.target.value)}
            maxLength={254}
            autoComplete="email"
            className="w-full rounded-xl border border-[#E1E7F0] bg-white px-4 py-3 text-sm text-[#14233B] outline-none transition focus:border-[#3976D8] focus:ring-2 focus:ring-[#3976D8]/15"
            placeholder="Your email won't be displayed"
          />
        </div>

        <div>
          <label
            htmlFor={`comment-content-${parentId ?? "new"}`}
            className="mb-2 block text-sm font-medium text-[#14233B]"
          >
            {parentId ? "Your reply" : "Your comment"}
          </label>
          <textarea
            id={`comment-content-${parentId ?? "new"}`}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
            minLength={3}
            maxLength={2000}
            rows={4}
            className="w-full resize-y rounded-xl border border-[#E1E7F0] bg-white px-4 py-3 text-sm leading-6 text-[#14233B] outline-none transition focus:border-[#3976D8] focus:ring-2 focus:ring-[#3976D8]/15"
            placeholder={
              parentId
                ? "Write a thoughtful reply..."
                : "Share your thoughts or ask a question..."
            }
          />
          <p className="mt-1 text-right text-xs text-[#647188]">
            {content.length}/2000
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[#14233B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263D60] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Submitting..."
            : parentId
              ? "Submit reply"
              : "Post comment"}
        </button>
      </form>
    );
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  return (
    <section
      id="comments"
      className="mt-12 border-t border-[#E8ECF2] pt-10"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3976D8]">
          Join the conversation
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#14233B] sm:text-3xl">
          Comments and replies
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#647188]">
          Have a question or something useful to share? We&apos;d love to hear
          from you. Please keep the conversation respectful and helpful.
        </p>
      </div>

      {notice && (
        <p
          role="status"
          className="mt-5 rounded-xl border border-[#D8E5FA] bg-[#F4F7FC] p-4 text-sm leading-6 text-[#315B9A]"
        >
          {notice}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-[#E8ECF2] bg-[#FAFBFD] p-5 sm:p-7">
        <h3 className="text-lg font-semibold text-[#14233B]">
          Leave a comment
        </h3>
        {renderCommentForm()}
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold text-[#14233B]">
          Reader discussion (
          {comments.reduce(
            (total, comment) => total + 1 + comment.replies.length,
            0
          )}
          )
        </h3>

        {comments.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-[#D9E1ED] px-5 py-10 text-center">
            <p className="font-medium text-[#14233B]">
              Start the conversation
            </p>
            <p className="mt-2 text-sm leading-6 text-[#647188]">
              No comments yet. Share a thought or ask a question.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-6">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-2xl border border-[#E8ECF2] p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-[#14233B]">
                    {comment.authorName}
                  </p>
                  <time
                    dateTime={comment.createdAt}
                    className="text-xs text-[#647188]"
                  >
                    {formatDate(comment.createdAt)}
                  </time>
                </div>

                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#526078]">
                  {comment.content}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(
                      replyingTo === comment.id ? null : comment.id
                    );
                    setError("");
                    setNotice("");
                    setContent("");
                  }}
                  className="mt-4 text-sm font-semibold text-[#315B9A] hover:text-[#3976D8]"
                >
                  {replyingTo === comment.id ? "Cancel reply" : "Reply"}
                </button>

                {replyingTo === comment.id && (
                  <div className="mt-3 rounded-xl bg-[#FAFBFD] p-4 sm:p-5">
                    {renderCommentForm(comment.id)}
                  </div>
                )}

                {comment.replies.length > 0 && (
                  <div className="mt-6 space-y-4 border-l-2 border-[#D8E5FA] pl-4 sm:pl-6">
                    {comment.replies.map((reply) => (
                      <div key={reply.id}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-[#14233B]">
                            {reply.authorName}
                          </p>
                          <time
                            dateTime={reply.createdAt}
                            className="text-xs text-[#647188]"
                          >
                            {formatDate(reply.createdAt)}
                          </time>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-[#526078]">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}