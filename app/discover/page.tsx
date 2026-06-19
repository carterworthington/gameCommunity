"use client";

import { DashboardLayout } from "@/components/DashboardLayout";

export default function DiscoverPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-bold mb-8">Discover Games</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Friend</label>
              <select className="w-full px-4 py-2 border rounded-lg">
                <option>All Friends</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Console</label>
              <div className="space-y-2">
                {["PS5", "Xbox Series X", "Nintendo Switch", "PC"].map((console) => (
                  <label key={console} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">{console}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Apply Filters
            </button>
          </div>

          {/* Games List */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">
                Add friends first to see what games they're playing!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
