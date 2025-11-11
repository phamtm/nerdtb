import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "monaco-editor/min/vs/editor/editor.main.css";
import "monaco-editor/esm/vs/base/browser/ui/codicons/codicon/codicon.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diff Viewer",
  description: "JSON diff viewer powered by Monaco Editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
