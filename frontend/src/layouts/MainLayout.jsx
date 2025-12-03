import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import FloatingNav from "../components/FloatingNav";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      
      {/* Navigation - Floats above content */}
      <FloatingNav />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-8 md:px-20 py-10 w-full max-w-[1920px] mx-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
      
    </div>
  );
}