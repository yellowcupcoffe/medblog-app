import { useState } from "react";
import api from "../../utils/api"; // Renamed from 'axios' for clarity
import { useNavigate } from "react-router-dom";
import { Stethoscope, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Attempt Login
      const res = await api.post("/admin/login", { email, password });
      
      // 2. Success
      const token = res.data.token;
      localStorage.setItem("token", token);
      navigate("/admin/dashboard");

    } catch (err) {
      console.error("Login Error Details:", err);

      // 3. Better Error Handling
      if (!err.response) {
        setError("Network Error. Check your internet or backend URL.");
      } else if (err.response.status === 401) {
        setError("Incorrect email or password.");
      } else if (err.response.status === 404) {
        setError("Login route not found (404). Check API URL.");
      } else {
        setError("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-blue-50 px-4 relative overflow-hidden">
      
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/70 shadow-2xl rounded-[2.5rem] p-10 max-w-md w-full border border-white/50 relative z-10"
      >
        
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-white rounded-2xl shadow-lg mb-6 text-rose-500">
            <Stethoscope size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-serif">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Enter your credentials to access the workspace.
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          
          {/* Email Input */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={20} />
            <input
              type="email"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all placeholder-gray-400 text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={20} />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all placeholder-gray-400 text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-4 rounded-2xl bg-gray-900 text-white font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

      </motion.div>
    </div>
  );
}