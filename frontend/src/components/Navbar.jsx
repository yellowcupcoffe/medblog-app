import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Stethoscope, Sparkles, Menu, X } from "lucide-react";
import SubscribeModal from "./SubscribeModal"; // <--- IMPORT THIS

export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // --- NEW: Modal State ---
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blogs" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-white/50 shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-rose-200 rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-2 bg-gradient-to-br from-rose-500 to-purple-600 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform">
                <Stethoscope size={20} strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent font-serif tracking-wide">
              MedBlog
            </span>
          </Link>

          {/* --- DESKTOP NAV --- */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group py-2"
                >
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isActive ? "text-rose-600" : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  >
                    {link.name}
                  </span>
                  
                  {/* Hover Underline Animation */}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-rose-400 to-purple-400 transition-all duration-300 rounded-full ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              );
            })}

            {/* CTA Button - Triggers Modal */}
            <button
              onClick={() => setSubscribeOpen(true)}
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Sparkles size={16} className="text-yellow-300" />
              <span>Subscribe</span>
            </button>
          </div>

          {/* --- MOBILE MENU TOGGLE --- */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-0 top-20 z-40 bg-white/95 backdrop-blur-xl md:hidden p-6 flex flex-col gap-6 border-t border-gray-100"
        >
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-2xl font-serif font-medium ${
                location.pathname === link.path ? "text-rose-600" : "text-gray-800"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-gray-100 w-full my-2" />
          
          {/* Mobile Subscribe Button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setSubscribeOpen(true);
            }}
            className="w-full py-4 bg-gray-900 text-white text-center rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles size={18} className="text-yellow-300" />
            Subscribe for Updates
          </button>
        </motion.div>
      )}

      {/* --- RENDER MODAL --- */}
      <SubscribeModal open={subscribeOpen} onClose={() => setSubscribeOpen(false)} />
    </>
  );
}