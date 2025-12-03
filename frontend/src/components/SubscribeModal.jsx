import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Added 'User' icon to imports
import { X, Mail, Sparkles, CheckCircle, ArrowRight, Loader2, User } from "lucide-react";
import api from "../utils/api";

export default function SubscribeModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  // 1. Added Name state
  const [name, setName] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      // 2. Sending both email AND name to backend
      await api.post("/api/subscribers/subscribe", { email, name });
      
      setSuccess(true);
      setEmail("");
      setName(""); // Clear name field
      
      // Close automatically after 2.5 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      console.error(err);
      // Customized error message based on backend response could be added here
      alert(err.response?.data?.message || "Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-[1000] p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              // THIS is the class that makes it glass/pinkish
              className="bg-white/95 backdrop-blur-xl border border-white/50 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto relative"
            >
              
              {/* Decorative Blur Effect (The pink blob) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8 md:p-10 text-center relative z-0">
                
                {success ? (
                  // --- SUCCESS STATE ---
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-10 flex flex-col items-center"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <CheckCircle size={40} strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">You're on the list!</h2>
                    <p className="text-gray-500">Watch your inbox for the next story.</p>
                  </motion.div>
                ) : (
                  // --- INPUT FORM STATE ---
                  <>
                    {/* Header Icon (Pink gradient) */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-100 to-purple-100 text-rose-500 rounded-2xl mb-6 shadow-sm">
                      <Mail size={32} />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-3 font-serif">
                      Stay Updated
                    </h2>
                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                      Join our community. Get the latest medical insights and stories delivered to your inbox.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      
                      {/* --- 3. NEW NAME INPUT (Matching Style) --- */}
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          {/* User Icon with pink focus color */}
                          <User className="h-5 w-5 text-gray-400 group-focus-within:text-rose-400 transition-colors" />
                        </div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          // Exact same styling classes as the email input below
                          className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all placeholder-gray-400"
                          placeholder="Your Name"
                        />
                      </div>

                      {/* Email Input */}
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Sparkles className="h-5 w-5 text-gray-400 group-focus-within:text-rose-400 transition-colors" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all placeholder-gray-400"
                          placeholder="doctor@example.com"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <>
                            <span>Subscribe Now</span>
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    </form>

                    <p className="mt-6 text-xs text-gray-400">
                      No spam. Unsubscribe at any time.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}