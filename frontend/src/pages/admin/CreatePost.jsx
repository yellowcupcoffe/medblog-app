import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Layout, Tag, Link as LinkIcon, 
  Image as ImageIcon, Save, PenLine, Loader2, Bell, BellOff 
} from "lucide-react";
import Editor from "../../components/Editor";
import CoverUpload from "../../components/CoverUpload"; // Using the Simple Version
import api from "../../utils/api";

export default function CreatePost() {
  const navigate = useNavigate();
  
  // State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [notify, setNotify] = useState(false);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-generate slug
  const autoSlug = (value) => {
    setTitle(value);
    setSlug(
      value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    );
  };

  // Save Post Handler
  const savePost = async () => {
    if (!title) return alert("Please add a title.");
    
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      await api.post(
        "/api/posts",
        {
          title,
          slug,
          content,
          coverImage,
          published,
          notify,
          category,
          tags: tags ? tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0) : [],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Post created successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 py-10 px-4 md:px-8">
      
      {/* Top Navigation Bar */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <Link 
          to="/admin/dashboard" 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={18} />
          <span className="font-medium text-sm">Back to Dashboard</span>
        </Link>
        
        <div className="text-sm font-medium text-gray-400">
          {published ? (
            <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Publishing Live
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Saving as Draft
            </span>
          )}
        </div>
      </div>

      {/* Main Glass Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/60 overflow-hidden relative"
      >
        {/* Decorative Top Blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="p-8 md:p-12 space-y-10">
          
          {/* Section 1: Title & Slug */}
          <div className="space-y-6">
            <div className="relative group">
              <PenLine className="absolute left-0 top-6 text-gray-300 group-focus-within:text-rose-400 transition-colors" size={32} />
              <input
                className="w-full pl-12 bg-transparent border-b-2 border-gray-100 text-4xl md:text-5xl font-bold font-serif text-gray-900 placeholder-gray-300 focus:border-rose-400 focus:outline-none transition-colors py-4"
                value={title}
                onChange={(e) => autoSlug(e.target.value)}
                placeholder="Write a beautiful title..."
                autoFocus
              />
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 max-w-2xl">
              <LinkIcon size={16} className="text-gray-400 shrink-0" />
              <span className="text-gray-400 text-sm font-mono shrink-0">/blog/</span>
              <input
                className="w-full bg-transparent text-sm text-gray-600 font-mono focus:outline-none placeholder-gray-400"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-slug"
              />
            </div>
          </div>

          {/* Section 2: Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <Layout size={16} /> Category
              </label>
              <div className="relative">
                <select
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all appearance-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  <option value="MBBS Life">MBBS Life</option>
                  <option value="Study Tips">Study Tips</option>
                  <option value="Research">Research</option>
                  <option value="Human Stories">Human Stories</option>
                  <option value="Physiology">Physiology</option>
                  <option value="NEET UG Journey">NEET UG Journey</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <Tag size={16} /> Tags
              </label>
              <input
                type="text"
                placeholder="comma separated tags (ex: mbbs, kota, study)"
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          {/* --- SECTION 3: VISUALS (THIS WAS MISSING IN YOUR SCREENSHOT) --- */}
          <div className="space-y-3">
             {/* This component handles the upload logic */}
             <CoverUpload coverImage={coverImage} setCoverImage={setCoverImage} />
          </div>

          {/* Section 4: Editor */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
              <PenLine size={16} /> Story Content
            </label>
            <div className="prose-editor-wrapper bg-white border border-gray-200 rounded-[1.5rem] overflow-hidden min-h-[400px] shadow-sm focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-400 transition-all">
              <Editor content={content} setContent={setContent} />
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-100">
            
            <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto">
              {/* Publish Toggle */}
              <div 
                onClick={() => setPublished(!published)}
                className="flex items-center gap-4 cursor-pointer group flex-1"
              >
                <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${published ? "bg-green-500" : "bg-gray-200"}`}>
                  <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${published ? "translate-x-6" : "translate-x-0"}`} />
                </div>
                <div className="flex flex-col">
                  <span className={`font-bold text-sm transition-colors ${published ? "text-green-600" : "text-gray-500"}`}>
                    {published ? "Publish Immediately" : "Save as Draft"}
                  </span>
                  <span className="text-xs text-gray-400">Visible to public</span>
                </div>
              </div>

              {/* Newsletter Toggle */}
              <div 
                onClick={() => published && setNotify(!notify)}
                className={`flex items-center gap-4 cursor-pointer group flex-1 transition-opacity ${published ? "opacity-100" : "opacity-40 pointer-events-none"}`}
              >
                <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${notify ? "bg-blue-500" : "bg-gray-200"}`}>
                  <div className={`w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center transform transition-transform duration-300 ${notify ? "translate-x-6" : "translate-x-0"}`}>
                    {notify ? <Bell size={12} className="text-blue-500" /> : <BellOff size={12} className="text-gray-400" />}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className={`font-bold text-sm transition-colors ${notify ? "text-blue-600" : "text-gray-500"}`}>
                    Send Newsletter
                  </span>
                  <span className="text-xs text-gray-400">Email subscribers</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={savePost}
              disabled={loading}
              className="w-full md:w-auto px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Create Post</span>
                </>
              )}
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}