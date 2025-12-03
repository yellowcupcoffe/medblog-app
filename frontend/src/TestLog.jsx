import React, { useEffect } from "react";
import api from "./utils/api";

export default function TestLog() {
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/api/media/list?folder=medblog/theme_pics");
        console.log("✔ BACKEND RETURNED:", res.data);

      } catch (err) {
        console.error("❌ ERROR:", err);
      }
    }
    load();
  }, []);

  return <div style={{ padding: 40 }}>Open console</div>;
}
