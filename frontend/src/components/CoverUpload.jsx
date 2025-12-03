import { useState } from "react";
import { UploadCloud, X, Image as ImageIcon, Loader2 } from "lucide-react";
import api from "../utils/api";

export default function CoverUpload({ coverImage, setCoverImage }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    // 1. GET THE TOKEN
    const token = localStorage.getItem("token");

    try {
      const res = await api.post("/api/posts/upload", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          // 2. SEND THE TOKEN
          Authorization: `Bearer ${token}` 
        },
      });
      setCoverImage(res.data.url);
    } catch (err) {
      console.error("Upload failed:", err);
      // Helpful error message if 401 happens again
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please log in again.");
      } else {
        alert("Failed to upload image. Check server logs.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
        <ImageIcon size={16} /> Cover Image
      </label>

      <div className="relative w-full">
        {coverImage ? (
          // --- PREVIEW STATE ---
          <div className="relative w-full h-64 rounded-[1.5rem] overflow-hidden shadow-md group border border-gray-200">
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button
                onClick={() => setCoverImage("")}
                className="bg-white text-red-500 px-5 py-2.5 rounded-full font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
              >
                <X size={18} /> Remove Image
              </button>
            </div>
          </div>
        ) : (
          // --- UPLOAD BUTTON STATE ---
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-[1.5rem] cursor-pointer hover:bg-gray-50 hover:border-indigo-300 hover:shadow-lg transition-all group bg-white/50">
            
            {uploading ? (
              <div className="flex flex-col items-center text-indigo-500">
                <Loader2 size={32} className="animate-spin mb-2" />
                <span className="text-sm font-medium">Uploading...</span>
              </div>
            ) : (
              <>
                <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud size={28} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Click to upload image
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WebP
                </p>
              </>
            )}

            {/* The Standard File Input */}
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              accept="image/*"
              disabled={uploading}
            />
          </label>
        )}
      </div>
    </div>
  );
}