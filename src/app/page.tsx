import Image from "next/image";

export default function Home() {
  return (
    // Container and styling for the main content area of the homepage
    // The overall page structure (header, footer, min-h-screen) is handled by layout.tsx
    <div className="container mx-auto p-8 flex flex-col items-center text-center">
      <div className="my-10">
        <Image
          src="/HopeLogo.png" // Ensure HopeLogo.png is in the public folder
          alt="Hope's Sober Living Logo"
          width={250}
          height={250}
          priority
          className="rounded-lg shadow-lg"
        />
      </div>
      <h1 className="text-4xl font-bold text-[var(--accent-green)] mb-6">
        Welcome to Hope's Sober Living
      </h1>
      <p className="text-lg text-slate-700 mb-4 max-w-2xl">
        A supportive and safe environment dedicated to helping individuals on their journey to recovery.
        We provide a structured and caring home to foster growth, healing, and a new beginning.
      </p>
      <p className="text-lg text-slate-700 max-w-2xl">
        Discover a place where hope is restored and futures are rebuilt.
      </p>
    </div>
  );
}
