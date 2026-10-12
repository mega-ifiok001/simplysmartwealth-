
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



const allowedSubjects = [
  "General enquiry",
  "Article feedback",
  "Partnership opportunity",
  "Advertising enquiry",
  "Technical issue",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const subject =
      typeof body.subject === "string"
        ? body.subject.trim()
        : "General enquiry";
    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    if (!name || name.length > 100) {
      return NextResponse.json(
        { error: "Please enter a name of up to 100 characters." },
        { status: 400 }
      );
    }

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!allowedSubjects.includes(subject)) {
      return NextResponse.json(
        { error: "Please select a valid enquiry subject." },
        { status: 400 }
      );
    }

    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        { error: "Your message must be between 10 and 5000 characters." },
        { status: 400 }
      );
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Your message has been received successfully.",
        contact: contactMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact submission error:", error);

    return NextResponse.json(
      { error: "We couldn't send your message. Please try again." },
      { status: 500 }
    );
  }
}
