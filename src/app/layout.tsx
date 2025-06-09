import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Hope's Sober Living",
  description: "A supportive and safe environment for recovery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-100 text-slate-800 font-[family-name:var(--font-geist-sans)]`}
      >
        <div className="flex flex-col min-h-screen">
          <header className="bg-blue-800 text-white p-4 shadow-md sticky top-0 z-50">
            <nav className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold hover:text-amber-300 transition-colors">
                Hope's Sober Living
              </Link>
              <div>
                <Link href="/" className="px-3 py-2 hover:text-amber-300 transition-colors">
                  Home
                </Link>
                <Link href="/about" className="px-3 py-2 hover:text-amber-300 transition-colors">
                  About Us
                </Link>
              </div>
            </nav>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-slate-800 text-stone-300 p-6 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Hope's Sober Living. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
