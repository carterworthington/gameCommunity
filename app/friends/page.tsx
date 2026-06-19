"use client";

import { DashboardLayout } from "@/components/DashboardLayout";

export default function FriendsPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-bold mb-8">Friends</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search Section */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Add Friends</h2>
            <input
              type="text"
              placeholder="Search username..."
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
              Search
            </button>
          </div>

          {/* Friends List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Your Friends</h2>
              <p className="text-gray-600">You haven't added any friends yet.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
              <p className="text-gray-600">No pending friend requests.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
