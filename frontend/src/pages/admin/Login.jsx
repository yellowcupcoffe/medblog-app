import { useState } from "react";
import axios from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/admin/login", { email, password });
      const token = res.data.token;

      localStorage.setItem("token", token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 px-4">
      <div className="backdrop-blur-xl bg-white/40 shadow-2xl rounded-3xl p-10 max-w-md w-full border border-white/30">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Admin Login
        </h1>
        <p className="text-center mt-2 text-gray-600">
          A private portal for authorized access
        </p>

        {/* Form */}
        <form className="mt-8 flex flex-col gap-5" onSubmit={handleLogin}>
          <div>
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="mt-1 w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type="password"
              className="mt-1 w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
            />
          </div>

          {error && (
            <p className="text-red-600 text-center text-sm mt-1">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
}
