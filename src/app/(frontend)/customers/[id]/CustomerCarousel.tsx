"use client";

import { useState } from "react";

interface CustomerCarouselProps {
  images: string[];
}

export default function CustomerCarousel({ images }: CustomerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) return null;

  return (
    <div className="relative w-full aspect-[21/9] md:aspect-[32/10] bg-muted/20 rounded-[8px] overflow-hidden group">
      {/* Current Slide Image */}
      <img
        src={images[currentIndex]}
        alt={`Property Slide ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-500 ease-in-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

      {/* Slide Index Badge */}
      <div className="absolute bottom-3 left-4 text-white font-bold text-[13px] bg-black/40 px-2.5 py-1 rounded-[4px] backdrop-blur-sm">
        Property Highlight {currentIndex + 1} / {images.length}
      </div>

      {/* Control Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <i className="ri-arrow-left-s-line text-[20px]" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <i className="ri-arrow-right-s-line text-[20px]" />
      </button>
    </div>
  );
}
