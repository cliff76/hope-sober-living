"use client"; // Required for useState and useEffect

import Image from "next/image";
import { useState, useEffect } from "react";

const interiorImages = [
  '/interior1.jpg',
  '/interior2.jpg',
  '/interior3.jpg',
  '/interior4.jpg',
  '/interior5.jpg',
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % interiorImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, []);

  return (
    <>
      {/* Background Image Slideshow */}
      <div className="fixed inset-0 -z-10">
        {interiorImages.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt="Hope's Sober Living Interior"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }} // Equivalent to object-cover
            className={`transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            priority={index === 0} // Prioritize loading the first image
          />
        ))}
      </div>

      {/* Main Page Content */}
      {/* Added 'relative' and 'z-0' to ensure it's above the -z-10 background */}
      {/* Added a semi-transparent background to the content box for better readability */}
      <div className="container mx-auto p-8 flex flex-col items-center text-center relative z-0">
        <div className="bg-white/75 dark:bg-slate-800/75 p-6 sm:p-10 rounded-xl shadow-xl">
          <div className="my-6 sm:my-10">
            <Image
              src="/HopeLogo.png" // Ensure HopeLogo.png is in the public folder
              alt="Hope's Sober Living Logo"
              width={200} // Adjusted size for potentially smaller content box
              height={200} // Adjusted size
              priority
              className="rounded-lg shadow-lg mx-auto"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--accent-green)] mb-6">
            Welcome to Hope's Sober Living
          </h1>
          <p className="text-md sm:text-lg text-slate-700 dark:text-stone-300 mb-4 max-w-2xl">
            A supportive and safe environment dedicated to helping individuals on their journey to recovery.
            We provide a structured and caring home to foster growth, healing, and a new beginning.
          </p>
          <p className="text-md sm:text-lg text-slate-700 dark:text-stone-300 max-w-2xl">
            Discover a place where hope is restored and futures are rebuilt.
          </p>
        </div>
      </div>
    </>
  );
}
