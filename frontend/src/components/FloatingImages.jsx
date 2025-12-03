// src/components/FloatingImages.jsx
import React, { useMemo } from "react";
import { useTheme } from "../contexts/ThemeContext";

/**
 * FloatingImages
 *
 * Props:
 *  - visible (bool) default true (if false, renders nothing)
 *  - density (int) number of floating images to show (default 6)
 *  - opacity (0..1) top-level opacity for decorations (default 0.12)
 */
export default function FloatingImages({ visible = true, density = 6, opacity = 0.12 }) {
  const ctx = useTheme();
  const images = (ctx && ctx.images && ctx.images.length) ? ctx.images : [];

  if (!visible) return null;

  // fallback small set if none available
  const fallbackBase = "https://res.cloudinary.com/dkzmky42r/image/upload";
  const fallback = [
    `${fallbackBase}/v1764413187/photo_6149833267805359190_y_jhw935.jpg`,
    `${fallbackBase}/v1764413187/photo_6149833267805359189_y_zoaemc.jpg`,
    `${fallbackBase}/v1764413186/photo_6149833267805359187_y_sffpn5.jpg`,
    `${fallbackBase}/v1764413186/photo_6144413188/photo_6149833267805359191_y_rud2b7.jpg`,
  ];

  const pool = images.length ? images : fallback;

  // pick N images (repeat if not enough)
  const chosen = useMemo(() => {
    const arr = [];
    for (let i = 0; i < density; i++) {
      arr.push(pool[i % pool.length]);
    }
    return arr;
  }, [pool, density]);

  return (
    <div aria-hidden="true" className="floating-root" style={{ opacity }}>
      {chosen.map((src, i) => {
        // distribute positions + animation duration
        const left = (i * 17) % 100;
        const top = (20 + (i * 13)) % 85;
        const size = 80 + (i % 3) * 30; // px
        const rotate = (i % 5) * 8 - 12;
        const duration = 20 + (i % 4) * 7;

        return (
          <div
            key={i}
            className="floating-card"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size * 1.15,
              transform: `rotate(${rotate}deg)`,
              animationDuration: `${duration}s`,
              backgroundImage: `url("${src}")`,
            }}
          />
        );
      })}
    </div>
  );
}
