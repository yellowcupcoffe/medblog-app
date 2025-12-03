import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, MessageSquare, Trash2, Calendar, Inbox, 
  FileText, ExternalLink, Mail, Globe 
} from "lucide-react";
import api from "../../utils/api";

// --- Skeleton Loader ---
const TableSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
    ))}
  </div>
);

export default function FeedbackPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- LOAD FEEDBACK ---
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await api.get("/api/feedback", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
      } catch (err) {
        console.error("Load feedback error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // --- DELETE FEEDBACK ---
  async function remove(id) {
    if (!window.confirm("Delete this message?")) return;
    
    setItems((prev) => prev.filter((x) => x.id !== id));

    const token = localStorage.getItem("token");
    try {
      await api.delete(`/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      alert("Failed to delete.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 py-10 px-4 md:px-8">
      
      {/* Header Area */}
      <div className="max-w-5xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            to="/admin/dashboard" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={18} />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <h1 className="text-4xl font-bold font-serif text-gray-900 flex items-center gap-3">
            <MessageSquare className="text-rose-500" size={32} />
            Inbox
          </h1>
          <p className="text-gray-500 mt-2">Messages from your readers & contact form.</p>
        </div>
        
        <div className="bg-white px-5 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-600">
          Total: {items.length}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto relative min-h-[500px]">
        
        <div className="space-y-6">
          {loading ? (
            <TableSkeleton />
          ) : items.length === 0 ? (
            // Empty State
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/60 p-20 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Inbox size={48} className="text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 font-serif">Inbox Empty</h3>
              <p className="text-gray-500 mt-2">No messages or feedback yet.</p>
            </div>
          ) : (
            // Feedback List
            <AnimatePresence>
              {items.map((f, idx) => {
                const isDirectMessage = !f.post; // If no post attached, it's from "Get in Touch"

                return (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white/90 backdrop-blur-md border border-gray-100 p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-rose-100 transition-all relative overflow-hidden"
                  >
                    {/* Visual Indicator Strip */}
                    <div 
                      className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        isDirectMessage ? "bg-gradient-to-b from-purple-500 to-indigo-600" : "bg-gradient-to-b from-rose-400 to-pink-500"
                      }`} 
                    />

                    <div className="flex flex-col md:flex-row gap-8 pl-4">
                      
                      {/* Left: User Info */}
                      <div className="flex-shrink-0 flex md:flex-col items-center md:items-start gap-4 md:w-56 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md ${
                            isDirectMessage ? "bg-purple-500" : "bg-rose-500"
                          }`}>
                            {f.email.charAt(0).toUpperCase()}
                          </div>
                          
                          {/* Mobile Date */}
                          <div className="md:hidden flex flex-col">
                             <span className="text-xs text-gray-400">
                               {new Date(f.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                             </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col w-full overflow-hidden">
                          <span className="text-sm font-bold text-gray-900 truncate" title={f.email}>
                            {f.email}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {isDirectMessage ? "Direct Message" : "Reader"}
                          </span>
                          
                          {/* Desktop Date */}
                          <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-400 mt-4 bg-gray-50 px-2 py-1 rounded-lg w-fit">
                            <Calendar size={12} />
                            <span>{new Date(f.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Content & Source */}
                      <div className="flex-grow flex flex-col gap-4">
                        
                        {/* Source Badge */}
                        <div className="flex justify-between items-start">
                          {isDirectMessage ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider rounded-full border border-purple-100">
                              <Mail size={14} />
                              From: Get in Touch
                            </span>
                          ) : (
                            <Link 
                              to={`/blog/${f.post.slug}`} 
                              target="_blank"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider rounded-full border border-rose-100 hover:bg-rose-100 transition-colors"
                            >
                              <FileText size={14} />
                              Re: {f.post.title}
                              <ExternalLink size={12} />
                            </Link>
                          )}

                          <button
                            onClick={() => remove(f.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            title="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        {/* Message Bubble */}
                        <div className="relative">
                          <div className="text-gray-700 text-base leading-relaxed bg-gray-50/80 p-5 rounded-2xl rounded-tl-none border border-gray-100">
                            {f.message}
                          </div>
                          {/* Triangle decoration */}
                          <svg className="absolute -top-2 left-0 w-4 h-4 text-gray-50/80 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
                             <path d="M0 0 L10 10 L20 0" />
                          </svg>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}