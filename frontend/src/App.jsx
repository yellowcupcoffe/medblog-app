import { Routes, Route } from "react-router-dom";
import FloatingNav from "./components/FloatingNav";

// --- Public Pages ---
import Home from "./pages/Home";
import About from "./pages/About";
import BlogList from "./pages/BlogList"; 
import SinglePost from "./pages/SinglePost"; 
import Login from "./pages/Login"; 

// --- Admin Pages ---
import Dashboard from "./pages/admin/Dashboard";
import CreatePost from "./pages/admin/CreatePost";
import EditPost from "./pages/admin/EditPost";
import FeedbackPage from "./pages/admin/FeedbackPage";
// 👇 IMPORT THE CORRECT FILE (SubscribersPage)
import Subs from "./pages/admin/Subscriberspage"; 

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-rose-200 pb-32">
      
      <FloatingNav /> 

      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blog/:slug" element={<SinglePost />} />
        <Route path="/login" element={<Login />} />

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/create" element={<CreatePost />} />
        <Route path="/admin/edit/:id" element={<EditPost />} />
        <Route path="/admin/feedback" element={<FeedbackPage />} />
        
        {/* 👇 THIS MUST BE INSIDE <Routes> 👇 */}
        <Route path="/admin/subscribers" element={<Subs />} />
        
        {/* --- 404 FALLBACK --- */}
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-[60vh] text-center">
            <div>
              <h1 className="text-6xl font-serif text-gray-200 mb-4">404</h1>
              <p className="text-gray-500">Page not found</p>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;