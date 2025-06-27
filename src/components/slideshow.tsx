'use client';
import {useEffect, useState} from "react";
import Image from "next/image";

const interiorImages = [
    '/interior1.jpg',
    '/interior2.jpg',
    '/interior3.jpg',
    '/interior4.jpg',
    '/interior5.jpg',
];

export function Slideshow() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % interiorImages.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(timer); // Clean up the interval on a component unmount
    }, []);

    return <div className="fixed inset-0 -z-10">
        {interiorImages.map((src, index) => (
            <Image
                key={src}
                src={src}
                alt="Hope's Sober Living Interior"
                fill
                sizes="100vw"
                style={{objectFit: 'cover'}} // Equivalent to object-cover
                className={`transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                priority={index === 0} // Prioritize loading the first image
            />
        ))}
    </div>;
}