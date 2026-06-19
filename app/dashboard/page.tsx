"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-600 text-sm font-semibold mb-2">My Games</h2>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-600 text-sm font-semibold mb-2">Friends</h2>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-600 text-sm font-semibold mb-2">Status</h2>
            <p className="text-lg font-semibold text-gray-700">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Offline
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/games"
              className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="font-semibold text-blue-600">Add Games</h3>
              <p className="text-sm text-gray-600">Log games you play</p>
            </a>
            <a
              href="/friends"
              className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition"
            >
              <h3 className="font-semibold text-green-600">Add Friends</h3>
              <p className="text-sm text-gray-600">Find your friends</p>
            </a>
            <a
              href="/discover"
              className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition"
            >
              <h3 className="font-semibold text-purple-600">Discover Games</h3>
              <p className="text-sm text-gray-600">See what friends play</p>
            </a>
            <a
              href="/profile"
              className="p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition"
            >
              <h3 className="font-semibold text-orange-600">My Profile</h3>
              <p className="text-sm text-gray-600">View your profile</p>
            </a>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-8 bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Getting Started</h2>
          <ol className="space-y-2 text-gray-700">
            <li>
              <span className="font-semibold">1.</span> Go to{" "}
              <a href="/games" className="text-blue-600 hover:underline">
                My Games
              </a>{" "}
              and add games you play
            </li>
            <li>
              <span className="font-semibold">2.</span> Set your availability status
            </li>
            <li>
              <span className="font-semibold">3.</span> Find friends in{" "}
              <a href="/friends" className="text-blue-600 hover:underline">
                Friends
              </a>
            </li>
            <li>
              <span className="font-semibold">4.</span> Check{" "}
              <a href="/discover" className="text-blue-600 hover:underline">
                Discover
              </a>{" "}
              to see what games your friends play
            </li>
          </ol>
        </div>
      </div>
    </DashboardLayout>
  );
}
