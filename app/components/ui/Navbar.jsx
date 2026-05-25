"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBasket } from "../../hooks/useBasket";
import { ShoppingBasket, LogOut, User, BarChart2, BookOpen } from "lucide-react";

export default function Navbar({ user, profile }) {
 
  const router = useRouter();
  const { basketCount } = useBasket();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:text-red-300 transition-colors">
          <BookOpen size={22} />
          Book Store
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Avatar */}
          {profile?.avatar && (
            <img
              src={profile.avatar}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover border-2 border-gray-600"
            />
          )}

          {/* Chart */}
          <Link
            href="/chart"
            className="flex items-center gap-1 px-3 py-1.5 rounded border border-green-500 text-green-400 hover:bg-green-500 hover:text-white text-sm transition-colors"
          >
            <BarChart2 size={15} />
            Chart
          </Link>

          {/* Profile */}
          <Link
            href="/profile"
            className="flex items-center gap-1 px-3 py-1.5 rounded border border-green-500 text-green-400 hover:bg-green-500 hover:text-white text-sm transition-colors"
          >
            <User size={15} />
            {user?.username || "Profile"}
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded border border-red-500 text-red-400 hover:bg-red-500 hover:text-white text-sm transition-colors"
          >
            <LogOut size={15} />
            Logout
          </button>

          {/* Basket */}
          <Link
            href="/basket"
            className="relative flex items-center px-3 py-1.5 rounded hover:bg-gray-700 transition-colors"
          >
            <ShoppingBasket size={20} />
            {basketCount >= 0  && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {basketCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}