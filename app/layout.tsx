import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Health Insurance Comparison Dashboard",
  description: "Compare Indian health insurance plans with deep actuarial analysis",
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
