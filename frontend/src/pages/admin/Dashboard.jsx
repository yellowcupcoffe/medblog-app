import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // <--- Added useNavigate
import { motion } from "framer-motion";
import { 
  Plus, BarChart3, FileText, Eye, Edit3, Trash2, 
  Search, MessageSquare, ExternalLink, CheckCircle, Users, LogOut // <--- Added LogOut icon
} from "lucide-react";
import api from "../../utils/api";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // <--- Hook for redirection

  // --- LOAD DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/api/posts/admin/all", { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setPosts(res.data || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
        // If token is invalid, auto-logout
        if (err.response && err.response.status === 401) {
           localStorage.removeItem("token");
           navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, navigate]);

  // --- LOGOUT ACTION ---
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      navigate("/admin/login");
    }
  };

  // --- DELETE ACTION ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/api/posts/${id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Could not delete post.");
    }
  };

  // --- STATS CALCULATION ---
  const publishedCount = posts.filter((p) => p.published).length;
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
  
  // --- FILTER ---
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold font-serif text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your medical insights and track performance.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Feedback */}
            <Link 
              to="/admin/feedback" 
              className="flex items-center gap-2 px-5 py-3 bg-white text-gray-700 font-medium rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <MessageSquare size={18} />
              <span className="hidden sm:inline">Feedback</span>
            </Link>

            {/* Subscribers */}
            <Link 
              to="/admin/subscribers" 
              className="flex items-center gap-2 px-5 py-3 bg-white text-gray-700 font-medium rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <Users size={18} />
              <span className="hidden sm:inline">Subscribers</span>
            </Link>

            {/* New Post */}
            <Link 
              to="/admin/create" 
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <Plus size={18} />
              <span>New Post</span>
            </Link>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-12 h-12 bg-white text-rose-500 border border-rose-100 rounded-2xl shadow-sm hover:bg-rose-500 hover:text-white hover:shadow-md transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Posts" 
            value={posts.length} 
            icon={FileText} 
            color="bg-blue-500" 
            delay={0.1}
          />
          <StatCard 
            title="Published" 
            value={publishedCount} 
            icon={CheckCircle} 
            color="bg-green-500" 
            delay={0.2}
          />
          <StatCard 
            title="Total Views" 
            value={totalViews.toLocaleString()} 
            icon={Eye} 
            color="bg-purple-500" 
            delay={0.3}
          />
        </div>

        {/* --- CONTENT AREA --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/50 overflow-hidden"
        >
          {/* Table Toolbar */}
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 size={20} className="text-rose-500" />
              Recent Activity
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search posts..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Article Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Views</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  // Skeleton Rows
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No posts found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-blue-50/30 transition-colors group">
                      
                      {/* Title & Slug */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
                          {post.title}
                        </div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5 truncate max-w-[200px]">
                          /{post.slug}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4">
                        {post.published ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Views */}
                      <td className="px-6 py-4 text-center font-medium text-gray-600">
                        {post.views?.toLocaleString() || 0}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <Link 
                            to={`/blog/${post.slug}`} 
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View Live"
                          >
                            <ExternalLink size={18} />
                          </Link>
                          <Link 
                            to={`/admin/edit/${post.id}`} 
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit3 size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(post.id)} 
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-[2rem] p-6 shadow-lg border border-gray-100 flex items-center gap-4 hover:shadow-xl transition-shadow"
  >
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-md`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-gray-800 mt-0.5">{value}</h3>
    </div>
  </motion.div>
);

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-5 bg-gray-200 rounded w-48 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-24" />
    </td>
    <td className="px-6 py-4">
      <div className="h-6 bg-gray-100 rounded-full w-20" />
    </td>
    <td className="px-6 py-4 text-center">
      <div className="h-4 bg-gray-200 rounded w-8 mx-auto" />
    </td>
    <td className="px-6 py-4 flex justify-center gap-3">
      <div className="h-8 w-8 bg-gray-100 rounded-lg" />
      <div className="h-8 w-8 bg-gray-100 rounded-lg" />
      <div className="h-8 w-8 bg-gray-100 rounded-lg" />
    </td>
  </tr>
);