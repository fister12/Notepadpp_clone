import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ColabPad - Collaborative Code Editor",
  description: "A web-based collaborative code editor inspired by Notepad++. Edit code together in real-time with syntax highlighting, file management, and seamless collaboration.",
  keywords: ["code editor", "collaborative", "notepad++", "real-time", "programming", "development"],
  authors: [{ name: "ColabPad Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "ColabPad - Collaborative Code Editor",
    description: "Edit code together in real-time with our collaborative editor",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ColabPad - Collaborative Code Editor",
    description: "Edit code together in real-time with our collaborative editor",
  },
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
