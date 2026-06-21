"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const availabilityLabels: Record<string, { label: string; dotClass: string }> = {
  available: { label: "Available", dotClass: "bg-green-500" },
  away: { label: "Away", dotClass: "bg-yellow-500" },
  offline: { label: "Offline", dotClass: "bg-red-500" },
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [availability, setAvailability] = useState<"available" | "away" | "offline">("offline");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Fetching status...");

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch("/api/availability", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load availability");
        }
        const data = await response.json();
        setAvailability(data.status ?? "offline");
        setStatusMessage("");
      } catch (error) {
        console.error(error);
        setStatusMessage("Unable to load status.");
      }
    };

    fetchAvailability();
  }, []);

  const updateAvailability = async (newStatus: "available" | "away" | "offline") => {
    if (newStatus === availability) {
      setStatusMessage(`Already ${newStatus}.`);
      return;
    }

    setLoading(true);
    setStatusMessage("Updating status...");

    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to update availability");
      }

      setAvailability(newStatus);
      setStatusMessage(`${availabilityLabels[newStatus].label} selected.`);
    } catch (error) {
      console.error(error);
      setStatusMessage("Unable to update availability.");
    } finally {
      setLoading(false);
    }
  };

  const current = availabilityLabels[availability] ?? availabilityLabels.offline;

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow dark:bg-slate-800">
            <h2 className="text-gray-600 text-sm font-semibold mb-2 dark:text-slate-300">My Games</h2>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow dark:bg-slate-800">
            <h2 className="text-gray-600 text-sm font-semibold mb-2 dark:text-slate-300">Friends</h2>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow dark:bg-slate-800">
            <h2 className="text-gray-600 text-sm font-semibold mb-2 dark:text-slate-300">Status</h2>
            <p className="text-lg font-semibold text-gray-700 dark:text-slate-100">
              <span className={`inline-block w-3 h-3 ${current.dotClass} rounded-full mr-2`}></span>
              {current.label}
            </p>
          </div>
        </div>

        {/* Availability Controls */}
        <div className="bg-white p-6 rounded-lg shadow mb-8 dark:bg-slate-800">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 dark:text-slate-100">Availability</h2>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Switch your availability to let friends know when you are online.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {(["available", "away", "offline"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={loading}
                  onClick={() => updateAvailability(status)}
                  className={`px-4 py-2 rounded-lg border font-semibold transition ${
                    availability === status
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {availabilityLabels[status].label}
                </button>
              ))}
            </div>

            {statusMessage ? (
              <p className="text-sm text-slate-600">{statusMessage}</p>
            ) : null}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow dark:bg-slate-800">
          <h2 className="text-2xl font-bold mb-4 dark:text-slate-100">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/games"
              className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <h3 className="font-semibold text-blue-600 dark:text-blue-300">Add Games</h3>
              <p className="text-sm text-gray-600 dark:text-slate-300">Log games you play</p>
            </a>
            <a
              href="/friends"
              className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <h3 className="font-semibold text-green-600 dark:text-green-300">Add Friends</h3>
              <p className="text-sm text-gray-600 dark:text-slate-300">Find your friends</p>
            </a>
            <a
              href="/discover"
              className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <h3 className="font-semibold text-purple-600 dark:text-purple-300">Discover Games</h3>
              <p className="text-sm text-gray-600 dark:text-slate-300">See what friends play</p>
            </a>
            <a
              href="/profile"
              className="p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <h3 className="font-semibold text-orange-600 dark:text-orange-300">My Profile</h3>
              <p className="text-sm text-gray-600 dark:text-slate-300">View your profile</p>
            </a>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-8 bg-blue-50 border border-blue-200 p-6 rounded-lg dark:bg-slate-900 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-4 dark:text-slate-100">Getting Started</h2>
          <ol className="space-y-2 text-gray-700 dark:text-slate-300">
            <li>
              <span className="font-semibold">1.</span> Go to{" "}
              <a href="/games" className="text-blue-600 hover:underline dark:text-blue-300">
                My Games
              </a>{" "}
              and add games you play
            </li>
            <li>
              <span className="font-semibold">2.</span> Set your availability status
            </li>
            <li>
              <span className="font-semibold">3.</span> Find friends in{" "}
              <a href="/friends" className="text-blue-600 hover:underline dark:text-blue-300">
                Friends
              </a>
            </li>
            <li>
              <span className="font-semibold">4.</span> Check{" "}
              <a href="/discover" className="text-blue-600 hover:underline dark:text-blue-300">
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
