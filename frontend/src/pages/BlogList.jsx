import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, BookOpen, Clock, Calendar, ArrowRight } from "lucide-react";
import api from "../utils/api";

// --- HELPER: Image Component with Fallback (Same as About Page) ---
const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  return (
    <img
      src={error || !src ? "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800" : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

// --- HELPER: Skeleton Loader for Premium Feel ---
const BlogSkeleton = () => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 h-full flex flex-col">
    <div className="h-56 bg-gray-200 animate-pulse" />
    <div className="p-8 space-y-4">
      <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
      <div className="h-8 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

const categories = [
  "All",
  "MBBS Life",
  "Study Tips",
  "Research",
  "Human Stories",
  "Physiology",
  "NEET UG Journey",
];

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const res = await api.get("/api/posts?page=1&perPage=100");
        const data = res.data?.posts ?? [];
        if (!mounted) return;
        setPosts(data);
        setFiltered(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  const filterByCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === "All") setFiltered(posts);
    else setFiltered(posts.filter((p) => p.category === cat));
  };

  // Helper to strip HTML
  const getExcerpt = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "").slice(0, 120) + "...";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 text-rose-400" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-serif">
            Explore Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Deep dives into medicine, research updates, and stories from the journey.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center mb-16"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => filterByCategory(cat)}
                className={`relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive ? "text-white shadow-lg shadow-rose-500/25" : "text-gray-600 hover:bg-white hover:shadow-md bg-white/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              // Skeleton Loading State
              [...Array(6)].map((_, i) => (
                <div key={i}>
                  <BlogSkeleton />
                </div>
              ))
            ) : filtered.length === 0 ? (
              // Empty State
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20"
              >
                <div className="bg-white/50 backdrop-blur-md inline-block p-8 rounded-full mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl text-gray-600 font-medium">No articles found in this category.</h3>
              </motion.div>
            ) : (
              // Real Data
              filtered.map((post, idx) => (
                <motion.div
                  key={post.id || idx}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="h-full"
                >
                  <Link to={`/blog/${post.slug}`} className="block h-full group">
                    <article className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 h-full flex flex-col hover:-translate-y-2">
                      
                      {/* Image Container */}
                      <div className="relative h-64 overflow-hidden shrink-0">
                        <ImageWithFallback
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Category Badge Over Image */}
                        <div className="absolute top-4 left-4">
                          <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-xs font-bold text-gray-800 rounded-full uppercase tracking-wider shadow-sm">
                            {post.category || "General"}
                          </span>
                        </div>
                      </div>

                      {/* Content Container */}
                      <div className="p-8 flex flex-col flex-grow relative">
                        {/* Date */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 font-medium">
                          <Calendar className="w-3 h-3" />
                          {/* Add created_at if you have it in API response */}
                          <span>Recent Post</span> 
                        </div>

                        <h2 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-rose-600 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        
                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-grow">
                          {getExcerpt(post.content)}
                        </p>

                        <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto">
                           <div className="flex items-center gap-2 text-sm text-gray-500">
                              <BookOpen className="w-4 h-4" />
                              <span>5 min read</span>
                           </div>
                           <div className="flex items-center gap-2 text-rose-500 font-semibold group-hover:translate-x-1 transition-transform">
                              Read Article <ArrowRight className="w-4 h-4" />
                           </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}