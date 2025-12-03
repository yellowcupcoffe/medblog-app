// src/components/ThemeDecor.jsx
import React, { useMemo } from "react";

export default function ThemeDecor({ images = [] }) {
  if (!images.length) return null;

  // Shuffle images once per render
  const shuffled = useMemo(() => {
    return [...images].sort(() => Math.random() - 0.5);
  }, [images]);

  // Pick 15–18 images
  const pics = shuffled.slice(0, 18);

  // Decorative fixed positions (beautifully arranged)
  const positions = [
    "top-10 left-10 rotate-[-4deg]",
    "top-40 left-1/4 rotate-[3deg]",
    "top-60 left-1/2 rotate-[-2deg]",
    "top-20 right-20 rotate-[5deg]",
    "top-80 right-1/3 rotate-[-3deg]",
    "bottom-20 left-12 rotate-[2deg]",
    "bottom-44 left-1/3 rotate-[-5deg]",
    "bottom-32 right-24 rotate-[1deg]",
    "bottom-60 right-1/4 rotate-[-4deg]",
    "top-1/3 left-5 rotate-[3deg]",
    "top-1/2 right-5 rotate-[2deg]",
    "bottom-1/2 left-1/5 rotate-[-2deg]",
    "top-72 left-2/3 rotate-[1deg]",
    "bottom-80 right-1/3 rotate-[4deg]",
    "top-96 right-10 rotate-[-1deg]",
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {pics.map((img, i) => (
        <img
          key={i}
          src={img}
          className={`
            absolute w-36 h-36 object-cover rounded-xl
            opacity-[0.18] shadow-md blur-[1px]
            ${positions[i % positions.length]}
          `}
        />
      ))}
    </div>
  );
}
