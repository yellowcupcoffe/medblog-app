import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, BookOpen, Clock } from "lucide-react";

const LatestPosts = ({ posts }) => {
  // Safe check to prevent crashes
  const safePosts = Array.isArray(posts) ? posts : [];

  // Helper to strip HTML and truncate text (from your original code)
  const getExcerpt = (content) => {
    if (!content) return "";
    return content.replace(/<[^>]+>/g, "").slice(0, 120) + "...";
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-blue-50/50 via-white to-rose-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
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

        {/* Grid Layout */}
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
                    
                    {/* Image Area */}
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
                      // Fallback gradient if no image exists
                      <div className="relative h-56 w-full bg-gradient-to-br from-rose-100 to-blue-100 flex items-center justify-center shrink-0">
                        <BookOpen className="w-12 h-12 text-gray-400 opacity-50" />
                      </div>
                    )}

                    {/* Content Area */}
                    <div className="p-8 flex flex-col flex-grow">
                      
                      {/* Title */}
                      <h3 className="text-2xl mb-3 text-gray-800 group-hover:text-rose-500 transition-colors line-clamp-2 font-bold">
                        {post.title}
                      </h3>

                      {/* Excerpt (Using your logic) */}
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow leading-relaxed">
                        {getExcerpt(post.content)}
                      </p>

                      {/* Footer / Meta Data */}
                      <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                            {/* Assuming you might have createdAt later, otherwise 'Recent' */}
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}</span>
                            </div>
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
            // Empty State
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

export default LatestPosts;