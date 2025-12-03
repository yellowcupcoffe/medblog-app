// src/components/ThemeBackground.jsx
import React from "react";
import { useTheme } from "../contexts/ThemeContext";

/**
 * ThemeBackground
 * - Renders a very subtle collage background (blur + low opacity).
 * - Good for the "professional" look when opacity is tiny, or "personal" when slightly stronger.
 *
 * Props:
 *  - themeOverride (optional) : "professional"|"personal"
 */
export default function ThemeBackground({ themeOverride } = {}) {
  const { theme: ctxTheme, images } = useTheme() || {};
  const theme = themeOverride || ctxTheme || "professional";

  // If images array empty, use a safe Cloudinary sample pattern (you provided cloud name)
  const fallbackBase = "https://res.cloudinary.com/dkzmky42r/image/upload";
  const fallbackImages = [
    // a small curated set — these should exist in your Cloudinary account
    `${fallbackBase}/v1764413188/photo_6149833267805359191_y_rud2b7.jpg`,
`${fallbackBase}/v1764413187/photo_6149833267805359189_y_zoaemc.jpg`,
`${fallbackBase}/v1764413187/photo_6149833267805359190_y_jhw935.jpg`,
`${fallbackBase}/v1764413186/photo_6149833267805359187_y_sffpn5.jpg`,
`${fallbackBase}/v1764413186/photo_6149833267805359188_y_uzftq7.jpg`,
`${fallbackBase}/v1764413185/photo_6149833267805359186_y_mlz1vj.jpg`,
`${fallbackBase}/v1764413184/photo_6149833267805359185_y_sux7p9.jpg`,
`${fallbackBase}/v1764413177/photo_6149833267805359183_y_b76zig.jpg`,
`${fallbackBase}/v1764413177/photo_6149833267805359184_y_oqbmbi.jpg`,
`${fallbackBase}/v1764413176/photo_6149833267805359178_y_u2e4os.jpg`,
`${fallbackBase}/v1764413176/photo_6149833267805359180_y_ha5gwt.jpg`,
`${fallbackBase}/v1764413176/photo_6149833267805359182_x_fqs9ay.jpg`,
`${fallbackBase}/v1764413176/photo_6149833267805359181_y_ghfwn8.jpg`,
`${fallbackBase}/v1764413175/photo_6149833267805359179_y_snkok8.jpg`,
`${fallbackBase}/v1764413175/photo_6149833267805359176_y_npentl.jpg`,
`${fallbackBase}/v1764413174/photo_6149833267805359177_y_nal6pr.jpg`,
`${fallbackBase}/v1764413173/photo_6149833267805359174_y_gz6zge.jpg`,
`${fallbackBase}/v1764413173/photo_6149833267805359175_y_pbl0vz.jpg`,
`${fallbackBase}/v1764413173/photo_6149833267805359173_y_mnmrwr.jpg`,
`${fallbackBase}/v1764413172/photo_6149833267805359171_y_z8df2w.jpg`,
`${fallbackBase}/v1764413172/photo_6149833267805359172_y_abgutg.jpg`,
`${fallbackBase}/v1764413172/photo_6149833267805359168_y_f8nkqc.jpg`,
`${fallbackBase}/v1764413171/photo_6149833267805359169_y_hsvplh.jpg`,
`${fallbackBase}/v1764413171/photo_6149833267805359167_y_nrzjao.jpg`,
`${fallbackBase}/v1764413171/photo_6149833267805359170_x_eyeoif.jpg`,
`${fallbackBase}/v1764413170/photo_6149833267805359166_y_sh4nri.jpg`,
`${fallbackBase}/v1764413169/photo_6149833267805359164_y_gnknir.jpg`,
`${fallbackBase}/v1764413169/photo_6149833267805359165_x_uvs53m.jpg`,
`${fallbackBase}/v1764413168/photo_6149833267805359163_x_zzc41e.jpg`,
`${fallbackBase}/v1764413168/photo_6149833267805359162_y_phgyww.jpg`,
`${fallbackBase}/v1764413168/photo_6149833267805359160_y_ulvypr.jpg`,
`${fallbackBase}/v1764413167/photo_6149833267805359161_y_d7duup.jpg`,
`${fallbackBase}/v1764413167/photo_6149833267805359157_x_nlkqok.jpg`,
`${fallbackBase}/v1764413166/photo_6149833267805359159_y_r5plbo.jpg`,
`${fallbackBase}/v1764413165/photo_6149833267805359156_y_hdgm3b.jpg`,
`${fallbackBase}/v1764413164/photo_6149833267805359153_y_p8cfjr.jpg`,
`${fallbackBase}/v1764413164/photo_6149833267805359155_y_mtkyxo.jpg`,
`${fallbackBase}/v1764413164/photo_6149833267805359154_x_dxl3ny.jpg`,
`${fallbackBase}/v1764413164/photo_6149833267805359152_y_w5cppx.jpg`,
  ];

  const pool = images && images.length ? images : fallbackImages;

  // Choose up to 5 images for the background collage
  const collage = pool.slice(0, 5);

  // styling knobs
  const blur = theme === "personal" ? 18 : 24; // px
  const opacity = theme === "personal" ? 0.12 : 0.06;

  return (
    <div aria-hidden="true" className="theme-bg-root">
      <div
        className="theme-bg-collage"
        style={{
          filter: `blur(${blur}px)`,
          opacity,
        }}
      >
        {collage.map((src, i) => (
          <div
            key={i}
            className="theme-bg-image"
            style={{
              backgroundImage: `url("${src}")`,
              // vary position slightly
              left: `${(i * 23) % 100}%`,
              top: `${(i * 17) % 100}%`,
              transform: `rotate(${(i - 2) * 6}deg) scale(${1 + (i % 2) * 0.02})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
