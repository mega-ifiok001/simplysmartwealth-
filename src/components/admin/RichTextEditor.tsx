
"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      Underline,
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "article-editor-image",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder:
          "Start writing your article here. Add headings, explain your points, and insert images wherever they help your readers.",
      }),
    ],
    content: value,
    onUpdate: ({ editor: currentEditor }) => {
      onChangeRef.current(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[360px] px-5 py-5 text-base leading-8 text-[#14233B] outline-none sm:px-7 [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-7 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-7 [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#3976D8] [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-[#3976D8] [&_a]:underline [&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl",
      },
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  async function uploadImage(file?: File) {
    if (!file || !editor) return;

    setMessage("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage("Please select a JPG, PNG, WEBP, or GIF image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Images must be 5 MB or smaller.");
      return;
    }

    setUploading(true);

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
          result.error || "Unable to upload image. Please try again."
        );
      }

      editor
        .chain()
        .focus()
        .setImage({
          src: result.imageUrl,
          alt: file.name
            .replace(/\.[^.]+$/, "")
            .replace(/[-_]+/g, " ")
            .trim(),
        })
        .run();

      setMessage("Image uploaded and inserted successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Image upload failed. Please try again."
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function insertImageFromUrl() {
    if (!editor) return;

    const url = window.prompt("Paste the direct URL of your image:");

    if (!url) return;

    try {
      const parsedUrl = new URL(url.trim());

      if (
        parsedUrl.protocol !== "https:" &&
        parsedUrl.protocol !== "http:"
      ) {
        setMessage("Please use a valid HTTP or HTTPS image URL.");
        return;
      }

      const alt =
        window.prompt("Describe the image for accessibility:") || "";

      editor
        .chain()
        .focus()
        .setImage({
          src: parsedUrl.toString(),
          alt: alt.trim(),
        })
        .run();

      setMessage(
        "Image inserted. Make sure the image URL is publicly accessible."
      );
    } catch {
      setMessage("Please enter a valid image URL.");
    }
  }

  function insertLink() {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href as
      | string
      | undefined;

    const url = window.prompt(
      "Enter the link URL:",
      previousUrl || "https://"
    );

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    try {
      const parsedUrl = new URL(url.trim());

      if (
        !["http:", "https:", "mailto:"].includes(parsedUrl.protocol)
      ) {
        setMessage("Use a valid HTTP, HTTPS, or email link.");
        return;
      }

      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: parsedUrl.toString() })
        .run();

      setMessage("");
    } catch {
      setMessage("Please enter a valid link URL.");
    }
  }

  const buttonClass =
    "rounded-lg border border-[#D7DFEA] px-3 py-2 text-sm font-medium text-[#315B9A] transition hover:bg-[#EAF1FD] disabled:cursor-not-allowed disabled:opacity-50";

  if (!editor) {
    return (
      <div className="rounded-xl border border-[#E5EAF1] bg-white p-6 text-sm text-[#647188]">
        Loading article editor...
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#D7DFEA] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E5EAF1] bg-[#FAFBFD] p-3">
        <button
          type="button"
          className={buttonClass}
          aria-label="Bold"
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          className={`${buttonClass} italic`}
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>

        <button
          type="button"
          className={`${buttonClass} underline`}
          title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>

        <span className="mx-1 h-6 border-l border-[#D7DFEA]" />

        <button
          type="button"
          className={buttonClass}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          Paragraph
        </button>

        <button
          type="button"
          className={buttonClass}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          Heading 2
        </button>

        <button
          type="button"
          className={buttonClass}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          Heading 3
        </button>

        <span className="mx-1 h-6 border-l border-[#D7DFEA]" />

        <button
          type="button"
          className={buttonClass}
          title="Bulleted list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • Bullets
        </button>

        <button
          type="button"
          className={buttonClass}
          title="Numbered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. Numbered
        </button>

        <button
          type="button"
          className={buttonClass}
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </button>

        <span className="mx-1 h-6 border-l border-[#D7DFEA]" />

        <button
          type="button"
          className={buttonClass}
          title="Align left"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          Left
        </button>

        <button
          type="button"
          className={buttonClass}
          title="Align center"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          Center
        </button>

        <button
          type="button"
          className={buttonClass}
          title="Align right"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          Right
        </button>

        <button
          type="button"
          className={buttonClass}
          title="Insert hyperlink"
          onClick={insertLink}
        >
          Link
        </button>

        <button
          type="button"
          className={buttonClass}
          title="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↶ Undo
        </button>

        <button
          type="button"
          className={buttonClass}
          title="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↷ Redo
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-[#E5EAF1] px-4 py-3">
        <button
          type="button"
          className="rounded-xl bg-[#14233B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#263D60] disabled:opacity-60"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? "Uploading image..." : "↑ Upload image"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(event) => uploadImage(event.target.files?.[0])}
        />

        <button
          type="button"
          className={buttonClass}
          onClick={insertImageFromUrl}
        >
          Insert image URL
        </button>

        <p className="text-xs text-[#647188]">
          JPG, PNG, WEBP or GIF · Maximum 5 MB
        </p>
      </div>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="border-b border-[#E5EAF1] px-4 py-3 text-sm text-[#315B9A]"
        >
          {message}
        </p>
      )}

      <EditorContent editor={editor} />

      <div className="border-t border-[#E5EAF1] bg-[#FAFBFD] px-5 py-3 text-xs text-[#647188]">
        Tip: click inside a paragraph before inserting an image to place it
        where you want it in your article.
      </div>
    </section>
  );
}
