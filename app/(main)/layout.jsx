"use client";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import { useAuth } from "../hooks/useAuth";

export default function MainLayout({ children }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-red-300 border-t-red-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-red-50">
      <Navbar user={user} profile={profile} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}