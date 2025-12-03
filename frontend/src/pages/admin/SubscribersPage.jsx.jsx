import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Users, Trash2, Calendar, Mail, Search, ShieldCheck 
} from "lucide-react";
import api from "../../utils/api";

// --- Skeleton Loader ---
const TableSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
    ))}
  </div>
);

export default function Subs() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // --- LOAD SUBSCRIBERS ---
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      try {
        // ✅ FIXED ENDPOINT: Added "/admin/"
        const res = await api.get("/api/subscribers/admin/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubs(res.data);
      } catch (err) {
        console.error("Load subscribers error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // --- DELETE SUBSCRIBER ---
  async function remove(id) {
    if (!window.confirm("Remove this subscriber? They will stop receiving emails.")) return;
    
    // Optimistic update
    setSubs((prev) => prev.filter((x) => x.id !== id));

    const token = localStorage.getItem("token");
    try {
      await api.delete(`/api/subscribers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      alert("Failed to delete.");
    }
  }

  // Filter Logic
  const filteredSubs = subs.filter(s => 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 py-10 px-4 md:px-8">
      
      {/* Header Area */}
      <div className="max-w-4xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            to="/admin/dashboard" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={18} />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <h1 className="text-4xl font-bold font-serif text-gray-900 flex items-center gap-3">
            <Users className="text-rose-500" size={32} />
            Subscribers
          </h1>
          <p className="text-gray-500 mt-2">Manage your newsletter audience.</p>
        </div>
        
        <div className="bg-white px-5 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-600">
          Total Active: {subs.length}
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/60 overflow-hidden relative min-h-[500px]">
        {/* Decorative Top Blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />

        <div className="p-8">
          
          {/* Search Bar */}
          <div className="mb-8 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
            />
          </div>

          {loading ? (
            <TableSkeleton />
          ) : filteredSubs.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Mail size={40} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">No subscribers found</h3>
            </div>
          ) : (
            // List
            <div className="space-y-4">
              <AnimatePresence>
                {filteredSubs.map((s, idx) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 font-bold text-lg shadow-inner">
                        {s.email.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">{s.email}</span>
                          <ShieldCheck size={14} className="text-green-500" />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                          <Calendar size={12} />
                          <span>Joined: {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => remove(s.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Unsubscribe User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}