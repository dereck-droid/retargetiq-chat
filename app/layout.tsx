import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Retarget IQ Support Assistant",
  description: "AI-powered assistant for Retarget IQ support staff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
