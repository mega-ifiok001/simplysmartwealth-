
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Simply Smart Money: Practical Money Tips for Everyday Life",
    template: "%s | Simply Smart Money",
  },
  description:
    "Practical money tips for everyday life. Discover clear guides to saving, budgeting, making money online, side hustles, and building better financial habits.",
  applicationName: "Simply Smart Money",
  keywords: [
    "personal finance",
    "saving money",
    "budgeting",
    "making money online",
    "side hustles",
    "financial education",
    "money tips",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
