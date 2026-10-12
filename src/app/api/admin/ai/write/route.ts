
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-session";

const requestSchema = z.object({
  topic: z.string().trim().min(5).max(300),
  audience: z.enum(["Nigerian readers", "African readers", "Global readers"]),
  length: z.enum(["short", "medium", "long"]),
  tone: z.enum([
    "friendly and simple",
    "professional and practical",
    "engaging and conversational",
  ]),
});

const articleSchema = z.object({
  title: z.string().min(5).max(180),
  excerpt: z.string().min(20).max(400),
  content: z.string().min(100),
  tags: z.array(z.string()).max(8),
  seoTitle: z.string().max(180),
  seoDescription: z.string().max(300),
});

const wordTargets = {
  short: "700–900 words",
  medium: "1,100–1,400 words",
  long: "1,700–2,000 words",
};

export async function POST(request: Request) {
  try {
    const admin = await getAdminSession();

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Please sign in to use the AI writer." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const input = requestSchema.safeParse(body);

    if (!input.success) {
      return NextResponse.json(
        { success: false, error: "Check your topic and writing options." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "The AI writing service is not configured." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
You are the senior personal-finance editor for "Simply Smart Money:
Practical money tips for everyday life."

Write useful, original, trustworthy financial education for everyday people.
Make complex ideas easy for beginners to understand. Use realistic examples,
clear explanations, actionable steps, and a compelling opening.

Never invent statistics, studies, quotations, expert endorsements, or sources.
Do not promise guaranteed income, investment returns, or financial success.
For Nigeria-specific examples, use naira where appropriate and avoid presenting
changing financial rules or rates as certain unless verified.

Return valid JSON with exactly these fields:
{
  "title": "Clear, compelling article title",
  "excerpt": "A concise article summary",
  "content": "Article body as HTML",
  "tags": ["tag one", "tag two"],
  "seoTitle": "Search-friendly title",
  "seoDescription": "Search-friendly description"
}

The content field must contain HTML, not Markdown. Use only these tags:
<p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>.
Do not include <html>, <head>, <body>, scripts, styles, images, or a title
heading that merely repeats the article title.

Structure the article with an engaging introduction, descriptive headings,
practical examples, actionable takeaways, and a helpful conclusion.
Avoid padding, repetitive paragraphs, and exaggerated clickbait.
          `.trim(),
        },
        {
          role: "user",
          content: `
Write an article about: ${input.data.topic}

Target audience: ${input.data.audience}
Tone: ${input.data.tone}
Target length: ${wordTargets[input.data.length]}

Make the article specific to this topic, genuinely useful, and ready for
an editor to review before publication. Return JSON only.
          `.trim(),
        },
      ],
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("The AI returned an empty response.");
    }

    const parsed = articleSchema.safeParse(JSON.parse(responseText));

    if (!parsed.success) {
      throw new Error("The AI returned an unexpected article format.");
    }

    return NextResponse.json({
      success: true,
      article: parsed.data,
    });
  } catch (error) {
    console.error("AI article generation failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "We couldn't generate the article. Please try again. If the problem continues, check your API account and billing.",
      },
      { status: 500 }
    );
  }
}
