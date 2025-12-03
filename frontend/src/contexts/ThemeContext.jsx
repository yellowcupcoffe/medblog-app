// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("professional");
  const [images, setImages] = useState([]);

  useEffect(() => {
    // load saved theme
    api.get("/api/settings")
      .then((res) => setTheme(res.data?.theme || "professional"))
      .catch(() => {});

    // load images
    api.get("/api/media/list?folder=medblog/theme_pics")
      .then((res) => {
        const data = res.data;

        const normalized =
          Array.isArray(data)
            ? data.map((i) =>
                typeof i === "string"
                  ? i
                  : i.secure_url || i.url || i.public_id
              )
            : [];

        setImages(normalized);
      })
      .catch(() => setImages([]));
  }, []);

  async function changeTheme(newTheme) {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        "/api/settings/theme",
        { theme: newTheme },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTheme(newTheme);
    } catch (err) {
      console.error("Theme update failed:", err);
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, images, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
