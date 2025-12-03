import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, CheckCircle, Copy, Mail, Loader2 } from "lucide-react";
import api from "../utils/api";

export default function ContactModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const directEmail = "riddhima.p.singh@gmail.com";

  // Handle Copy Email
  const copyEmail = () => {
    navigator.clipboard.writeText(directEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !message) return;
    
    setLoading(true);
    try {
      // We send WITHOUT a postId, so the backend treats it as a general message
      await api.post("/api/feedback", { email, message });
      setSuccess(true);
      setEmail("");
      setMessage("");
      // Close automatically
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[1000] p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white/95 backdrop-blur-xl border border-white/50 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto relative"
            >
              
              {/* Decorative Blur */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="p-8 md:p-10 relative z-0">
                
                {success ? (
                  // --- SUCCESS STATE ---
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-10 flex flex-col items-center text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <CheckCircle size={40} strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">Message Sent!</h2>
                    <p className="text-gray-500">I'll get back to you as soon as possible.</p>
                  </motion.div>
                ) : (
                  // --- FORM STATE ---
                  <>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3 font-serif">
                      Get in Touch
                    </h2>
                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                      Have a question, collaboration idea, or just want to say hi? Drop a message below.
                    </p>

                    {/* Direct Mail Box */}
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 p-4 rounded-2xl mb-8">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-white rounded-full shadow-sm text-rose-500">
                          <Mail size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">For speedy reply</span>
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {directEmail}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={copyEmail}
                        className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                        title="Copy Email"
                      >
                        {copied ? <CheckCircle size={18} className="text-green-500"/> : <Copy size={18} />}
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-5 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-gray-400"
                          placeholder="Your email address"
                        />
                      </div>
                      <div>
                        <textarea
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-5 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl h-32 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder-gray-400 resize-none"
                          placeholder="What's on your mind?"
                        ></textarea>
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
                            <span>Send Message</span>
                            <Send size={18} />
                          </>
                        )}
                      </button>
                    </form>
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