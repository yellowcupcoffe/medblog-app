import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Calendar, BookOpen, Clock } from "lucide-react";
import api from "../utils/api";

// --- 1. HERO SECTION COMPONENT ---
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50">
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-rose-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-16 h-16 text-rose-400 mx-auto" />
          </motion.div>

          <h1 className="text-6xl md:text-8xl mb-6 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Medical Insights
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Exploring the intersection of medicine, research, and innovation. 
            Join me on a journey through healthcare, science, and continuous learning.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* ✅ FIXED: Changed /blog to /blogs to match your Router */}
            <Link
              to="/blogs"
              className="px-8 py-4 bg-gradient-to-r from-rose-500 to-purple-500 text-white rounded-full hover:shadow-2xl transition-all flex items-center gap-2 group"
            >
              Explore Articles
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-white/80 backdrop-blur-md text-gray-700 rounded-full hover:shadow-xl transition-all border border-gray-200"
            >
              About Me
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="text-3xl mb-2 bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              50+
            </div>
            <div className="text-gray-600">Articles Published</div>
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="text-3xl mb-2 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              10K+
            </div>
            <div className="text-gray-600">Monthly Readers</div>
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="text-3xl mb-2 bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
              5+
            </div>
            <div className="text-gray-600">Research Papers</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};

// --- 2. LATEST POSTS COMPONENT ---
const LatestPosts = ({ posts }) => {
  const safePosts = Array.isArray(posts) ? posts : [];

  const getExcerpt = (content) => {
    if (!content) return "";
    return content.replace(/<[^>]+>/g, "").slice(0, 120) + "...";
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-blue-50/50 via-white to-rose-50/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent font-bold">
            Latest Articles
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fresh perspectives on medicine, research, and healthcare innovation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {safePosts.length > 0 ? (
            safePosts.map((post, idx) => (
              <motion.article
                key={post.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="group h-full"
              >
                <Link to={`/blog/${post.slug}`} className="block h-full">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 h-full flex flex-col">
                    
                    {post.coverImage ? (
                      <div className="relative h-56 overflow-hidden shrink-0">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ) : (
                      <div className="relative h-56 w-full bg-gradient-to-br from-rose-100 to-blue-100 flex items-center justify-center shrink-0">
                        <BookOpen className="w-12 h-12 text-gray-400 opacity-50" />
                      </div>
                    )}

                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl mb-3 text-gray-800 group-hover:text-rose-500 transition-colors line-clamp-2 font-bold">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow leading-relaxed">
                        {getExcerpt(post.content)}
                      </p>
                      <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-rose-500 font-medium group-hover:gap-2 transition-all">
                          <span>Read more</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block"
              >
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">No posts yet. Stay tuned!</p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// --- 3. MAIN PAGE COMPONENT ---
export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await api.get("/api/posts?page=1&perPage=3");
        setPosts(res.data?.posts || []);
      } catch (err) {
        console.error("Home load error:", err);
      }
    }
    fetchPosts();
  }, []);

  return (
    <>
      <HeroSection />
      <LatestPosts posts={posts} />
    </>
  );
}