import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

// Public Pages
import Home from "../pages/Home";
import BlogList from "../pages/BlogList";
import BlogPage from "../pages/BlogPage";
import About from "../pages/About";

// Admin Pages
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import CreatePost from "../pages/admin/CreatePost";
import EditPost from "../pages/admin/EditPost";
import FeedbackPage from "../pages/admin/FeedbackPage";
import SubscribersList from "../pages/admin/SubscribersList"; 

// --- 🔒 SECURITY GUARD COMPONENT ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    // If no token, kick them to login
    return <Navigate to="/admin/login" replace />;
  }
  
  // If token exists, let them pass
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "blogs", element: <BlogList /> },
      { path: "blog/:slug", element: <BlogPage /> },
      { path: "about", element: <About /> },
    ],
  },

  // --- ADMIN ROUTES (Protected) ---
  { path: "/admin/login", element: <Login /> },
  
  { 
    path: "/admin/dashboard", 
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/admin/create", 
    element: (
      <ProtectedRoute>
        <CreatePost />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/admin/edit/:id", 
    element: (
      <ProtectedRoute>
        <EditPost />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/admin/feedback", 
    element: (
      <ProtectedRoute>
        <FeedbackPage />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/admin/subscribers", 
    element: (
      <ProtectedRoute>
        <SubscribersList />
      </ProtectedRoute>
    ) 
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}