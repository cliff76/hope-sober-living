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
          <header className="bg-[var(--sky-blue)] text-slate-800 p-4 shadow-md sticky top-0 z-50">
            <nav className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold hover:text-[var(--sunrise-gold)] transition-colors">
                Hope&#39;s Sober Living
              </Link>
              <div className="flex items-center">
                <Link href="/" className="px-3 py-2 hover:text-[var(--sunrise-gold)] transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Home
                </Link>
                <Link href="/testimonials" className="px-3 py-2 hover:text-[var(--sunrise-gold)] transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
                    <path fillRule="evenodd" d="M10 2c-1.717 0-3.402.396-4.931 1.152C3.54 3.91 2.37 5.496 1.654 7.309A12.924 12.924 0 001 10c0 2.21.59 4.304 1.654 6.091.716 1.813 1.886 3.399 3.423 4.159 1.529.756 3.214 1.152 4.93 1.152 1.717 0 3.402-.396 4.931-1.152 1.537-.76 2.707-2.346 3.423-4.159A12.924 12.924 0 0019 10c0-2.21-.59-4.304-1.654-6.091-.716-1.813-1.886-3.399-3.423-4.159A11.45 11.45 0 0010 2zM6.5 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm3-1.5a.5.5 0 01.5-.5h4a.5.5 0 010 1h-4a.5.5 0 01-.5-.5zm-1.5 3.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm3-1.5a.5.5 0 01.5-.5h4a.5.5 0 010 1h-4a.5.5 0 01-.5-.5z" clipRule="evenodd" />
                  </svg>
                  Testimonials
                </Link>
                <Link href="/about" className="px-3 py-2 hover:text-[var(--sunrise-gold)] transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  About Us
                </Link>
                <Link href="/member" className="px-3 py-2 hover:text-[var(--sunrise-gold)] transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
                    <path fillRule="evenodd" d="M10 2c-1.717 0-3.402.396-4.931 1.152C3.54 3.91 2.37 5.496 1.654 7.309A12.924 12.924 0 001 10c0 2.21.59 4.304 1.654 6.091.716 1.813 1.886 3.399 3.423 4.159 1.529.756 3.214 1.152 4.93 1.152 1.717 0 3.402-.396 4.931-1.152 1.537-.76 2.707-2.346 3.423-4.159A12.924 12.924 0 0019 10c0-2.21-.59-4.304-1.654-6.091-.716-1.813-1.886-3.399-3.423-4.159A11.45 11.45 0 0010 2zM6.5 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm3-1.5a.5.5 0 01.5-.5h4a.5.5 0 010 1h-4a.5.5 0 01-.5-.5zm-1.5 3.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm3-1.5a.5.5 0 01.5-.5h4a.5.5 0 010 1h-4a.5.5 0 01-.5-.5z" clipRule="evenodd" />
                  </svg>
                  Login
                </Link>
              </div>
            </nav>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-[var(--soft-green)] text-slate-800 p-6 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Hope&apos;s Sober Living. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
