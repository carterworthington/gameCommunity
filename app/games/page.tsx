"use client";

import { DashboardLayout } from "@/components/DashboardLayout";

export default function GamesPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-bold mb-8">My Games</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search Section */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Add Games</h2>
            <input
              type="text"
              placeholder="Search for a game..."
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Search
            </button>
            <p className="text-sm text-gray-600 mt-4">
              Search coming soon - IGDB API integration in progress
            </p>
          </div>

          {/* Games List */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">
                You haven't added any games yet. Search above to get started!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
