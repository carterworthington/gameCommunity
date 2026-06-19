"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gamepad2, Users, Compass, LogOut, User } from "lucide-react";
import { ReactNode } from "react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              GameCommunity
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Welcome, <strong>{session.user?.username}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow min-h-screen p-4">
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-gray-700"
            >
              <Gamepad2 size={20} />
              Dashboard
            </Link>
            <Link
              href="/games"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-gray-700"
            >
              <Gamepad2 size={20} />
              My Games
            </Link>
            <Link
              href="/discover"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-gray-700"
            >
              <Compass size={20} />
              Discover
            </Link>
            <Link
              href="/friends"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-gray-700"
            >
              <Users size={20} />
              Friends
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-gray-700"
            >
              <User size={20} />
              Profile
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
