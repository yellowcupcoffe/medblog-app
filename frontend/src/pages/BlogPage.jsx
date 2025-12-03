import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, Eye, Tag, Send, ArrowLeft, 
  Linkedin, Twitter, Facebook, MessageCircle, Link as LinkIcon, Check
} from "lucide-react";
import api from "../utils/api";
import ThemeBackground from "../components/ThemeBackground";

// --- HELPER: Skeleton Loader ---
const PostSkeleton = () => (
  <div className="max-w-4xl mx-auto px-6 pt-20 animate-pulse">
    <div className="h-8 w-32 bg-gray-200 rounded-full mb-6 mx-auto" />
    <div className="h-16 w-3/4 bg-gray-200 rounded-xl mb-6 mx-auto" />
    <div className="h-4 w-1/2 bg-gray-200 rounded mb-12 mx-auto" />
    <div className="h-96 w-full bg-gray-200 rounded-3xl mb-12" />
    <div className="space-y-4">
      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="h-4 w-5/6 bg-gray-200 rounded" />
    </div>
  </div>
);

export default function BlogPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [toc, setToc] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Feedback form
  const [fbEmail, setFbEmail] = useState("");
  const [fbMessage, setFbMessage] = useState("");
  const [fbLoading, setFbLoading] = useState(false);
  const [fbSent, setFbSent] = useState(false);

  const contentRef = useRef(null);

  // ----------------------------------------------------
  // LOAD DATA
  // ----------------------------------------------------
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get(`/api/posts/${slug}`);
        setPost(res.data);

        // Increment views
        api.post(`/api/posts/${slug}/view`).catch(() => {});

        // Fetch recommended
        const listRes = await api.get("/api/posts?page=1&perPage=6");
        const others = listRes.data.posts
          .filter((p) => p.slug !== slug)
          .slice(0, 3);

        setRecommended(others);
      } catch (err) {
        console.error("Error loading post:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  // ----------------------------------------------------
  // TOC & SCROLL
  // ----------------------------------------------------
  useEffect(() => {
    if (!post) return;
    const temp = document.createElement("div");
    temp.innerHTML = post.content;
    const headings = [...temp.querySelectorAll("h2")].map((h) => ({
      id: h.innerText.replace(/\s+/g, "-").toLowerCase().replace(/[^\w-]/g, ''),
      text: h.innerText,
    }));
    setToc(headings);
  }, [post]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      setProgress((scrolled / height) * 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ----------------------------------------------------
  // ACTIONS
  // ----------------------------------------------------
  async function sendFeedback(e) {
    e.preventDefault();
    if (!fbEmail || !fbMessage) return;
    setFbLoading(true);
    try {
      // Send postId so admin knows which blog this is about
      await api.post("/api/feedback", { 
        email: fbEmail, 
        message: fbMessage,
        postId: post.id 
      });
      setFbSent(true);
      setFbEmail("");
      setFbMessage("");
    } catch (err) {
      alert("Failed to send feedback.");
    } finally {
      setFbLoading(false);
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <PostSkeleton />;
  if (!post) return <div className="text-center py-20">Post not found.</div>;

  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`Check out this article: ${post.title}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 relative overflow-hidden">
      <ThemeBackground />

      <motion.div
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-rose-500 to-purple-600 z-[60] origin-left"
        style={{ width: `${progress}%` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20">
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-500 hover:text-rose-600 transition-colors mb-8"
        >
          <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium text-sm">Back</span>
        </motion.button>

        {/* HEADER */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 bg-rose-100 text-rose-600 text-xs font-bold tracking-wider uppercase rounded-full mb-6">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight font-serif">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-400" />
                {/* --- DATE FIX: INDIAN FORMAT (e.g., 1 December 2025) --- */}
                <span>
                  {new Date(post.createdAt).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span>{post.views} views</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* COVER IMAGE */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="max-w-5xl mx-auto mb-16 relative">
          <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={post.coverImage || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d"}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[2s]"
              alt={post.title}
            />
          </div>
        </motion.div>

        {/* CONTENT AREA */}
        <div className="flex flex-col lg:flex-row gap-12 items-start max-w-6xl mx-auto">
          {/* SIDEBAR: Table of Contents */}
          <aside className="lg:w-1/4 lg:sticky lg:top-32 order-2 lg:order-1">
            {toc.length > 0 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/50">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-rose-500" />
                  On this page
                </h3>
                <nav className="space-y-1">
                  {toc.map((item) => (
                    <a key={item.id} href={`#${item.id}`} className="block text-sm text-gray-600 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition-all">
                      {item.text}
                    </a>
                  ))}
                </nav>
              </motion.div>
            )}
          </aside>

          {/* ARTICLE TEXT */}
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            ref={contentRef}
            className="lg:w-3/4 order-1 lg:order-2 prose prose-lg prose-rose max-w-none prose-headings:font-serif prose-img:rounded-3xl"
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/<h2>(.*?)<\/h2>/g, (match, p1) => {
                const id = p1.replace(/\s+/g, "-").toLowerCase().replace(/[^\w-]/g, '');
                return `<h2 id="${id}" class="scroll-mt-24">${p1}</h2>`;
              }),
            }}
          />
        </div>

        {/* --- SOCIAL SHARE SECTION --- */}
        <div className="max-w-4xl mx-auto mt-20 pt-10 border-t border-gray-200">
          <h3 className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">
            Share this story
          </h3>
          
          <div className="flex flex-wrap justify-center gap-6">
            {/* WhatsApp */}
            <a 
              href={`https://wa.me/?text=${shareText}%20${shareUrl}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 bg-white rounded-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-[#25D366] border border-gray-100"
              aria-label="Share on WhatsApp"
            >
              <MessageCircle size={24} />
            </a>

            {/* Facebook */}
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 bg-white rounded-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-[#1877F2] border border-gray-100"
              aria-label="Share on Facebook"
            >
              <Facebook size={24} />
            </a>

            {/* LinkedIn */}
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 bg-white rounded-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-[#0077b5] border border-gray-100"
              aria-label="Share on LinkedIn"
            >
              <Linkedin size={24} />
            </a>

            {/* Twitter/X */}
            <a 
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 bg-white rounded-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-black border border-gray-100"
              aria-label="Share on Twitter"
            >
              <Twitter size={24} />
            </a>

            {/* Copy Link */}
            <button 
              onClick={handleCopyLink}
              className="p-4 bg-white rounded-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-gray-600 border border-gray-100 relative group"
              aria-label="Copy Link"
            >
              {copied ? <Check size={24} className="text-green-600" /> : <LinkIcon size={24} />}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {copied ? "Copied!" : "Copy Link"}
              </span>
            </button>
          </div>
        </div>

        {/* --- RECOMMENDED & FEEDBACK --- */}
        <div className="max-w-4xl mx-auto mt-20">
          
          {/* Recommended */}
          {recommended.length > 0 && (
            <section className="mb-20">
              <h2 className="text-3xl font-bold mb-8 text-center">Read Next</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {recommended.map((p) => (
                  <Link
                    key={p.id}
                    to={`/blog/${p.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="h-40 overflow-hidden">
                      <img
                        src={p.coverImage || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={p.title}
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-800 mt-2 group-hover:text-rose-600 transition-colors line-clamp-2">
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Feedback Form */}
          <section className="bg-gradient-to-br from-white to-rose-50 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <div className="inline-block p-3 bg-white rounded-2xl shadow-md mb-6">
                <Send className="w-6 h-6 text-rose-500" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Was this helpful?</h2>
              <p className="text-gray-600 mb-8">I'd love to hear your thoughts or questions.</p>

              {fbSent ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-100 text-green-800 px-6 py-4 rounded-xl inline-block font-medium">
                  Thank you! Your feedback has been sent.
                </motion.div>
              ) : (
                <form onSubmit={sendFeedback} className="space-y-4 text-left">
                  <input type="email" required placeholder="Your email (optional)" value={fbEmail} onChange={(e) => setFbEmail(e.target.value)} className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none" />
                  <textarea required placeholder="Your feedback..." value={fbMessage} onChange={(e) => setFbMessage(e.target.value)} className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl h-32 focus:ring-2 focus:ring-rose-500 outline-none resize-none"></textarea>
                  <button type="submit" disabled={fbLoading} className="w-full py-4 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all">
                    {fbLoading ? "Sending..." : "Send Feedback"}
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}