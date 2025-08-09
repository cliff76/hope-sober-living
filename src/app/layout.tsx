import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import {Header} from "@/app/header";
import {Footer} from "@/app/footer";

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

export default function AuthenticatedRootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider>
        <RootLayout>
          {children}
        </RootLayout>
      </ClerkProvider>
  );
  }

function RootLayout({
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
      <Header/>

      <main className="flex-grow">
        {children}
      </main>

      <Footer/>
    </div>
    </body>
    </html>
  );
}
