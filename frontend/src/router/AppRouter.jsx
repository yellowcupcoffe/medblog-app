import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import BlogList from "../pages/BlogList";
import BlogPage from "../pages/BlogPage";
import About from "../pages/About";

import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import CreatePost from "../pages/admin/CreatePost";
import EditPost from "../pages/admin/EditPost";
import FeedbackPage from "../pages/admin/FeedbackPage";
// 👇 1. IMPORT THIS
import NewsletterPage from "../pages/admin/NewsletterPage";

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

  // admin
  { path: "/admin/login", element: <Login /> },
  { path: "/admin/dashboard", element: <Dashboard /> },
  { path: "/admin/create", element: <CreatePost /> },
  { path: "/admin/edit/:id", element: <EditPost /> },
  { path: "/admin/feedback", element: <FeedbackPage /> },
  
  // 👇 2. ADD THIS ROUTE
  { path: "/admin/subscribers", element: <NewsletterPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}