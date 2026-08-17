import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Queue-it Max Outflow Explainer",
  description:
    "Interactive explainer for how Queue-it's max outflow logic works, with unit conversion and a minute-by-minute visual aid.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
