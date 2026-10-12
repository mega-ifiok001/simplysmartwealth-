
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import sanitizeHtml from "sanitize-html";
import { prisma } from "@/lib/prisma";
import CommentSection  from '../../../components/blog/CommentSection'

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getPublishedPost(slug: string) {
  return prisma.post.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    return {
      title: "Article Not Found | Simply Smart Money",
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: "article",
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
  };
}

async function ArticleContent({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    notFound();
  }

 const approvedComments = await prisma.comment.findMany({
  where: {
    postId: post.id,
    status: "APPROVED",
    parentId: null,
  },
  orderBy: { createdAt: "asc" },
  include: {
    replies: {
      where: { status: "APPROVED" },
      orderBy: { createdAt: "asc" },
    },
  },
});

const commentsForDisplay = approvedComments.map((comment) => ({
  id: comment.id,
  authorName: comment.authorName,
  content: comment.content,
  createdAt: comment.createdAt.toISOString(),
  replies: comment.replies.map((reply) => ({
    id: reply.id,
    authorName: reply.authorName,
    content: reply.content,
    createdAt: reply.createdAt.toISOString(),
  })),
}));

  // Sanitize editor-generated HTML before displaying it publicly.
  const safeContent = sanitizeHtml(post.content, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "h1",
      "h2",
      "h3",
      "u",
      "s",
      "del",
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height", "class"],
      a: ["href", "name", "target", "rel"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform(
        "a",
        {
          rel: "noopener noreferrer",
          target: "_blank",
        },
        true
      ),
    },
  });

  const publishedDate = post.publishedAt
    ? new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(post.publishedAt)
    : null;

  return (
    <main className="min-h-screen bg-white text-[#14233B]">
      <header className="border-b border-[#E8ECF2]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight sm:text-xl"
          >
            Simply Smart Money
          </Link>

          <Link
            href="/blog"
            className="text-sm font-medium text-[#526078] transition hover:text-[#3976D8]"
          >
            ← All articles
          </Link>
        </div>
      </header>

      <article>
        <section className="bg-[#F4F7FC]">
          <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
            <Link
              href={
                post.category
                  ? `/blog?category=${encodeURIComponent(post.category.slug)}`
                  : "/blog"
              }
              className="text-xs font-semibold uppercase tracking-[0.16em] text-[#3976D8]"
            >
              {post.category?.name ?? "Personal Finance"}
            </Link>

            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#647188]">
              {post.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#647188]">
              {post.author && <span>By {post.author.name}</span>}

              {publishedDate && (
                <>
                  {post.author && (
                    <span aria-hidden="true">·</span>
                  )}
                  <time dateTime={post.publishedAt!.toISOString()}>
                    {publishedDate}
                  </time>
                </>
              )}

              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </section>

        {post.coverImage && (
          <div className="mx-auto max-w-5xl px-5 pt-8 sm:px-8 sm:pt-12">
            <div className="overflow-hidden rounded-2xl bg-[#F4F7FC]">
              <img
                src={post.coverImage}
                alt={post.title}
                className="max-h-[560px] w-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16 lg:py-16">
          <div className="min-w-0">
            <div
              className={[
                "article-content break-words text-base leading-8 text-[#34445C] sm:text-lg sm:leading-9",
                "[&_p]:mb-5",
                "[&_h1]:mb-5 [&_h1]:mt-10 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:text-[#14233B]",
                "[&_h2]:mb-4 [&_h2]:mt-9 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-[#14233B]",
                "[&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#14233B]",
                "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6",
                "[&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6",
                "[&_li]:mb-2",
                "[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#3976D8] [&_blockquote]:pl-4 [&_blockquote]:text-[#526078]",
                "[&_a]:text-[#3976D8] [&_a]:underline [&_a]:underline-offset-4",
                "[&_strong]:font-bold [&_strong]:text-[#14233B]",
                "[&_img]:mx-auto [&_img]:my-7 [&_img]:block [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl",
                "[&_hr]:my-8 [&_hr]:border-[#E8ECF2]",
              ].join(" ")}
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />

            {post.tags.length > 0 && (
              <div className="mt-12 border-t border-[#E8ECF2] pt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#647188]">
                  Topics in this article
                </p>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#E1E7F0] bg-[#FAFBFD] px-3 py-2 text-sm text-[#526078]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 rounded-2xl bg-[#F4F7FC] p-6 sm:p-8">
              <CommentSection
  postSlug={post.slug}
  comments={commentsForDisplay}
/>
              <h2 className="text-xl font-semibold">
                Keep learning. Make smarter decisions.
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#647188]">
                Explore more practical guides to budgeting, saving, earning
                online, and building better financial habits.
              </p>

              <Link
                href="/blog"
                className="mt-5 inline-flex rounded-full bg-[#14233B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#263D60]"
              >
                Explore more articles →
              </Link>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-[#E8ECF2] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#3976D8]">
              Simply Smart Money
            </p>

            <h2 className="mt-3 text-lg font-semibold">
              Practical money tips for everyday life.
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#647188]">
              Clear, accessible financial education to help you make more
              informed decisions.
            </p>

            <Link
              href="/about"
              className="mt-5 inline-flex text-sm font-semibold text-[#315B9A] hover:underline"
            >
              About the author →
            </Link>
          </aside>
        </div>
      </article>

      <footer className="border-t border-[#E8ECF2]">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 text-sm text-[#647188] sm:px-8 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="font-semibold text-[#14233B]">
            Simply Smart Money
          </Link>

          <nav className="flex flex-wrap gap-5">
            <Link href="/about" className="hover:text-[#315B9A]">
              About Me
            </Link>
            <Link href="/contact" className="hover:text-[#315B9A]">
              Contact
            </Link>
            <Link href="/privacy-policy" className="hover:text-[#315B9A]">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function ArticleLoading() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="animate-pulse space-y-5">
          <div className="h-4 w-32 rounded bg-[#EAF1FD]" />
          <div className="h-10 max-w-2xl rounded bg-[#EAF1FD]" />
          <div className="h-4 max-w-xl rounded bg-[#F4F7FC]" />
          <div className="h-64 rounded-2xl bg-[#F4F7FC]" />
          <div className="h-4 rounded bg-[#EAF1FD]" />
          <div className="h-4 w-5/6 rounded bg-[#EAF1FD]" />
        </div>
      </div>
    </main>
  );
}

export default function ArticlePage({ params }: PageProps) {
  return (
    <Suspense fallback={<ArticleLoading />}>
      <ArticleContent params={params} />
    </Suspense>
  );
}
