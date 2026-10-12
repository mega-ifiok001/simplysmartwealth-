
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Category = {
  id: string;
  name: string;
};

type ArticleStatus = "DRAFT" | "PUBLISHED";

type InitialPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categoryId: string;
  tags: string[];
  featured: boolean;
  status: ArticleStatus;
};

type PostEditorFormProps = {
  categories: Category[];
  initialPost?: InitialPost;
};

type GeneratedArticle = {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
};

function createSlug(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PostEditorForm({
  categories,
  initialPost,
}: PostEditorFormProps) {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(initialPost?.id);

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(
    Boolean(initialPost?.slug)
  );
  const [excerpt, setExcerpt] = useState(
    initialPost?.excerpt ?? ""
  );
  const [content, setContent] = useState(
    initialPost?.content ?? ""
  );
  const [coverImage, setCoverImage] = useState(
    initialPost?.coverImage ?? ""
  );
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverError, setCoverError] = useState("");
  const [categoryId, setCategoryId] = useState(
    initialPost?.categoryId ?? ""
  );
  const [tags, setTags] = useState(
    initialPost?.tags.join(", ") ?? ""
  );
  const [featured, setFeatured] = useState(
    initialPost?.featured ?? false
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingStatus, setSavingStatus] =
    useState<ArticleStatus | null>(null);

  // AI Writer state
  const [aiTopic, setAiTopic] = useState("");
  const [aiAudience, setAiAudience] = useState("Nigerian readers");
  const [aiLength, setAiLength] = useState("medium");
  const [aiTone, setAiTone] = useState("friendly and simple");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiSuccess, setAiSuccess] = useState("");

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#D7DFEA] bg-white px-4 py-3 text-sm text-[#14233B] outline-none transition placeholder:text-[#94A0B2] focus:border-[#3976D8] focus:ring-2 focus:ring-[#3976D8]/10";

  const labelClass = "text-sm font-semibold text-[#14233B]";

  async function generateArticle() {
    if (aiLoading || saving || coverUploading) return;

    if (aiTopic.trim().length < 5) {
      setAiError("Enter an article topic with at least 5 characters.");
      return;
    }

    setAiLoading(true);
    setAiError("");
    setAiSuccess("");
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/ai/write", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: aiTopic.trim(),
          audience: aiAudience,
          length: aiLength,
          tone: aiTone,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.article) {
        throw new Error(
          result.error || "Unable to generate your article."
        );
      }

      const article = result.article as GeneratedArticle;

      setTitle(article.title);
      setSlug(createSlug(article.title));
      setSlugEdited(false);
      setExcerpt(article.excerpt);
      setContent(article.content);
      setTags(article.tags.join(", "));

      setAiSuccess(
        "Article generated successfully. Review and edit the content before saving."
      );
    } catch (generationError) {
      setAiError(
        generationError instanceof Error
          ? generationError.message
          : "Something went wrong while generating your article."
      );
    } finally {
      setAiLoading(false);
    }
  }

  async function uploadCoverImage(file?: File) {
    if (!file) return;

    setCoverError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setCoverError("Choose a JPG, PNG, WEBP, or GIF image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setCoverError("Cover images must be 5 MB or smaller.");
      return;
    }

    setCoverUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.imageUrl) {
        throw new Error(
          result.error || "Unable to upload your cover image."
        );
      }

      setCoverImage(result.imageUrl);
      setCoverError("");
    } catch (uploadError) {
      setCoverError(
        uploadError instanceof Error
          ? uploadError.message
          : "Cover image upload failed. Please try again."
      );
    } finally {
      setCoverUploading(false);

      if (coverInputRef.current) {
        coverInputRef.current.value = "";
      }
    }
  }

  async function handleSubmit(nextStatus: ArticleStatus) {
    if (saving) return;

    setError("");
    setSuccess("");

    if (aiLoading) {
      setError("Please wait for AI article generation to finish.");
      return;
    }

    if (coverUploading) {
      setError("Please wait for the cover image upload to finish.");
      return;
    }

    if (title.trim().length < 3) {
      setError("Please enter an article title of at least 3 characters.");
      return;
    }

    if (excerpt.trim().length < 10) {
      setError("Please write a short summary of at least 10 characters.");
      return;
    }

    if (content.replace(/<[^>]*>/g, " ").trim().length < 20) {
      setError("Your article content must contain at least 20 characters.");
      return;
    }

    const finalSlug = createSlug(slug || title);

    if (!finalSlug) {
      setError("Please enter a title that can form a valid URL.");
      return;
    }

    setSaving(true);
    setSavingStatus(nextStatus);

    try {
      const endpoint = isEditing
        ? `/api/admin/posts/${encodeURIComponent(initialPost!.id)}`
        : "/api/admin/posts";

      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          slug: finalSlug,
          excerpt: excerpt.trim(),
          content,
          coverImage: coverImage.trim() || null,
          categoryId: categoryId || null,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          featured,
          status: nextStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.error ||
            `We couldn't ${isEditing ? "update" : "save"} your article. Please try again.`
        );
        return;
      }

      setSuccess(
        isEditing
          ? nextStatus === "PUBLISHED"
            ? "Article updated and published successfully. Redirecting..."
            : "Article changes saved successfully. Redirecting..."
          : nextStatus === "PUBLISHED"
            ? "Article published successfully. Redirecting..."
            : "Draft saved successfully. Redirecting..."
      );

      router.push("/admin/posts");
      router.refresh();
    } catch {
      setError(
        "A connection error occurred. Please check your connection and try again."
      );
    } finally {
      setSaving(false);
      setSavingStatus(null);
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit("DRAFT");
      }}
      className="space-y-7"
    >
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-[#D7DFEA] bg-[#EAF1FD] px-4 py-3 text-sm text-[#315B9A]"
        >
          {success}
        </div>
      )}

      {/* AI ARTICLE WRITER */}
      <section className="rounded-2xl border border-[#D7DFEA] bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#14233B]">
              AI Article Writer
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#647188]">
              Turn a topic into a practical money guide. Generate a
              structured article and refine it in your editor.
            </p>
          </div>

          <span className="rounded-full bg-[#EAF1FD] px-3 py-1 text-xs font-semibold text-[#315B9A]">
            AI assisted
          </span>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="aiTopic" className={labelClass}>
              What should the article be about?
            </label>

            <textarea
              id="aiTopic"
              value={aiTopic}
              onChange={(event) => setAiTopic(event.target.value)}
              placeholder="Example: How Nigerians can build an emergency fund on a small salary"
              rows={3}
              minLength={5}
              maxLength={300}
              className={inputClass}
            />

            <p className="mt-1 text-xs text-[#647188]">
              Be specific about the problem your readers want to solve.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="aiAudience" className={labelClass}>
                Target audience
              </label>
              <select
                id="aiAudience"
                value={aiAudience}
                onChange={(event) => setAiAudience(event.target.value)}
                className={inputClass}
              >
                <option value="Nigerian readers">Nigerian readers</option>
                <option value="African readers">African readers</option>
                <option value="Global readers">Global readers</option>
              </select>
            </div>

            <div>
              <label htmlFor="aiLength" className={labelClass}>
                Article length
              </label>
              <select
                id="aiLength"
                value={aiLength}
                onChange={(event) => setAiLength(event.target.value)}
                className={inputClass}
              >
                <option value="short">Short — 700–900 words</option>
                <option value="medium">Medium — 1,100–1,400 words</option>
                <option value="long">Long — 1,700–2,000 words</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="aiTone" className={labelClass}>
                Writing style
              </label>
              <select
                id="aiTone"
                value={aiTone}
                onChange={(event) => setAiTone(event.target.value)}
                className={inputClass}
              >
                <option value="friendly and simple">Friendly and simple</option>
                <option value="professional and practical">
                  Professional and practical
                </option>
                <option value="engaging and conversational">
                  Engaging and conversational
                </option>
              </select>
            </div>
          </div>

          {aiError && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {aiError}
            </p>
          )}

          {aiSuccess && (
            <p role="status" className="rounded-xl border border-[#D7DFEA] bg-[#EAF1FD] px-4 py-3 text-sm leading-6 text-[#315B9A]">
              {aiSuccess}
            </p>
          )}

          <button
            type="button"
            onClick={generateArticle}
            disabled={aiLoading || saving || coverUploading}
            className="w-full rounded-xl bg-[#14233B] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#263D60] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {aiLoading ? "Writing your article..." : "Generate Article with AI"}
          </button>

          <p className="text-xs leading-5 text-[#647188]">
            AI generation may incur OpenAI API charges. Generated content
            fills the editor but is never published automatically.
          </p>
        </div>
      </section>

      {/* ARTICLE CONTENT */}
      <section className="rounded-2xl border border-[#E5EAF1] bg-white p-5 sm:p-7">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Article content</h2>
          <p className="mt-1 text-sm leading-6 text-[#647188]">
            Write practical money guides with headings, formatted text,
            links, lists, and images.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="title" className={labelClass}>
              Article title *
            </label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(event) => {
                const nextTitle = event.target.value;
                setTitle(nextTitle);

                if (!slugEdited) setSlug(createSlug(nextTitle));
              }}
              placeholder="e.g. How to Start Saving Money on a Small Salary"
              required
              minLength={3}
              maxLength={180}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="slug" className={labelClass}>
              Article URL slug
            </label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(event) => {
                setSlugEdited(true);
                setSlug(createSlug(event.target.value));
              }}
              placeholder="how-to-start-saving-money"
              className={inputClass}
            />
            <p className="mt-2 text-xs text-[#647188]">
              Your article address will look like /blog/{slug || "your-article-title"}.
            </p>
          </div>

          <div>
            <label htmlFor="excerpt" className={labelClass}>
              Short summary *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Tell readers what they will learn from this article."
              rows={3}
              required
              minLength={10}
              maxLength={500}
              className={inputClass}
            />
            <p className="mt-1 text-right text-xs text-[#647188]">
              {excerpt.length}/500 characters
            </p>
          </div>

          <div>
            <label className={labelClass}>Article body *</label>
            <div className="mt-2">
              <RichTextEditor value={content} onChange={setContent} />
            </div>
            <p className="mt-2 text-xs leading-5 text-[#647188]">
              Format your article, upload pictures from your device, or
              insert images using an internet URL.
            </p>
          </div>
        </div>
      </section>

      {/* ARTICLE DETAILS */}
      <section className="rounded-2xl border border-[#E5EAF1] bg-white p-5 sm:p-7">
        <h2 className="text-lg font-semibold">Article details</h2>
        <p className="mt-1 text-sm text-[#647188]">
          Organise your article so readers can discover it easily.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <select
              id="category"
              name="category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className={inputClass}
            >
              <option value="">Uncategorised</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {categories.length === 0 && (
              <p className="mt-2 text-xs text-[#647188]">
                No categories exist yet. You can save articles without a category.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="tags" className={labelClass}>
              Tags
            </label>
            <input
              id="tags"
              name="tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="budgeting, saving, personal finance"
              className={inputClass}
            />
            <p className="mt-2 text-xs text-[#647188]">
              Separate tags with commas.
            </p>
          </div>

          {/* COVER IMAGE */}
          <div>
            <label className={labelClass}>Cover image</label>
            <p className="mt-2 text-sm leading-6 text-[#647188]">
              Choose a featured image for your article. This appears on
              the blog cards and at the top of the article page.
            </p>

            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={coverUploading || saving || aiLoading}
                onClick={() => coverInputRef.current?.click()}
                className="rounded-xl bg-[#14233B] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#263D60] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {coverUploading
                  ? "Uploading cover image..."
                  : coverImage
                    ? "Replace cover image"
                    : "↑ Upload cover image"}
              </button>

              {coverImage && (
                <button
                  type="button"
                  disabled={coverUploading || saving || aiLoading}
                  onClick={() => {
                    setCoverImage("");
                    setCoverError("");
                  }}
                  className="rounded-xl border border-[#D7DFEA] px-4 py-3 text-sm font-semibold text-[#315B9A] transition hover:bg-[#FAFBFD] disabled:opacity-60"
                >
                  Remove image
                </button>
              )}
            </div>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(event) => uploadCoverImage(event.target.files?.[0])}
            />

            {coverError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {coverError}
              </p>
            )}

            {coverImage && (
              <div className="mt-5 overflow-hidden rounded-2xl border border-[#D7DFEA]">
                <div className="border-b border-[#E5EAF1] bg-[#FAFBFD] px-4 py-3 text-sm font-medium text-[#315B9A]">
                  Cover image preview
                </div>
                <img
                  src={coverImage}
                  alt="Preview of the article cover"
                  className="max-h-80 w-full bg-[#F4F7FC] object-contain"
                />
              </div>
            )}

            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-[#315B9A]">
                Or use an image URL
              </summary>
              <div className="mt-3">
                <label htmlFor="coverImage" className={labelClass}>
                  Cover image URL
                </label>
                <input
                  id="coverImage"
                  name="coverImage"
                  type="url"
                  value={coverImage}
                  onChange={(event) => {
                    setCoverImage(event.target.value);
                    setCoverError("");
                  }}
                  placeholder="https://example.com/your-image.jpg"
                  className={inputClass}
                />
                <p className="mt-2 text-xs leading-5 text-[#647188]">
                  Use a publicly accessible image URL beginning with HTTPS whenever possible.
                </p>
              </div>
            </details>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E5EAF1] p-4">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#3976D8]"
            />
            <span>
              <span className="block text-sm font-semibold">
                Feature this article
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#647188]">
                Mark this article as featured for highlighted sections of the website.
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* SAVE OR PUBLISH */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-[#647188]">
          Save privately as a draft, or publish when your article is ready.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={saving || coverUploading || aiLoading}
            onClick={() => void handleSubmit("DRAFT")}
            className="rounded-xl border border-[#D7DFEA] px-5 py-3 text-sm font-semibold text-[#315B9A] transition hover:bg-[#FAFBFD] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingStatus === "DRAFT"
              ? "Saving..."
              : isEditing
                ? "Save changes as draft"
                : "Save draft"}
          </button>

          <button
            type="button"
            disabled={saving || coverUploading || aiLoading}
            onClick={() => void handleSubmit("PUBLISHED")}
            className="rounded-xl bg-[#14233B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263D60] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingStatus === "PUBLISHED"
              ? "Publishing..."
              : isEditing
                ? "Save & publish"
                : "Publish article"}
          </button>
        </div>
      </div>
    </form>
  );
}
