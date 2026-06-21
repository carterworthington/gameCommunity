"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gamepad2, Users, Compass, LogOut, User } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white shadow dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              GameCommunity
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-slate-200">
              Welcome, <strong>{session.user?.username}</strong>
            </span>
            <ThemeToggle />
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
        <aside className="w-64 bg-white shadow min-h-screen p-4 dark:bg-slate-900">
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-gray-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Gamepad2 size={20} />
              Dashboard
            </Link>
            <Link
              href="/games"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-gray-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Gamepad2 size={20} />
              My Games
            </Link>
            <Link
              href="/discover"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-gray-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Compass size={20} />
              Discover
            </Link>
            <Link
              href="/friends"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-gray-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Users size={20} />
              Friends
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-gray-700 dark:text-slate-200 dark:hover:bg-slate-800"
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
