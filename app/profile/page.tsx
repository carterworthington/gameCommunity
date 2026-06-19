"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {session?.user?.username?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{session?.user?.username}</h2>
              <p className="text-gray-600">{session?.user?.email}</p>
              <p className="text-sm text-gray-500 mt-2">Member since {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600">Games</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-600">Friends</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">0</p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <a
              href="/games"
              className="block p-4 border rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="font-semibold text-blue-600">My Games</h3>
              <p className="text-sm text-gray-600">View and manage your game library</p>
            </a>
            <a
              href="/friends"
              className="block p-4 border rounded-lg hover:bg-green-50 transition"
            >
              <h3 className="font-semibold text-green-600">Friends & Followers</h3>
              <p className="text-sm text-gray-600">Manage your connections</p>
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
