import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, BookOpen, Sparkles } from "lucide-react";
import SubscribeModal from "./SubscribeModal"; // <--- Import the modal

const FloatingNav = () => {
  const location = useLocation();
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  const links = [
    { name: "Home", path: "/", icon: Home },
    { name: "Blogs", path: "/blogs", icon: BookOpen },
    { name: "About", path: "/about", icon: User },
  ];

  return (
    <>
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-center gap-1 p-2 rounded-full bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-rose-500/10"
        >
          {/* --- Navigation Links --- */}
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;

            return (
              <Link key={link.path} to={link.path} className="relative z-10">
                <div className="relative px-4 py-3 rounded-full flex flex-col items-center justify-center transition-all duration-300 group">
                  
                  {/* Active Indicator (The sliding bubble) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-purple-100 rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  <Icon
                    size={22}
                    className={`transition-colors duration-300 ${
                      isActive ? "text-rose-600" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  
                  {/* Tooltip */}
                  <span className="absolute -top-12 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                    {link.name}
                  </span>
                </div>
              </Link>
            );
          })}

          {/* --- Divider --- */}
          <div className="w-px h-8 bg-gray-200 mx-1" />

          {/* --- Subscribe Button --- */}
          <button
            onClick={() => setSubscribeOpen(true)}
            className="relative z-10 group"
          >
            <div className="relative px-4 py-3 rounded-full flex flex-col items-center justify-center transition-all duration-300 hover:bg-gray-100/50">
              
              <Sparkles
                size={22}
                className="text-yellow-500 group-hover:text-yellow-600 transition-colors"
                fill="currentColor"
                fillOpacity={0.2}
              />
              
              {/* Tooltip */}
              <span className="absolute -top-12 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                Subscribe
              </span>
            </div>
          </button>

        </motion.div>
      </div>

      {/* --- The Modal (Hidden by default) --- */}
      <SubscribeModal open={subscribeOpen} onClose={() => setSubscribeOpen(false)} />
    </>
  );
};

export default FloatingNav;