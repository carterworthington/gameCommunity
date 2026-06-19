"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";

type UserSummary = {
  id: string;
  username: string;
  avatar?: string;
  status: "none" | "friend" | "requested" | "requestReceived";
};

type FriendEntry = {
  id: string;
  friend: {
    id: string;
    username: string;
    avatar?: string;
  };
};

type FriendRequestEntry = {
  id: string;
  sender: {
    id: string;
    username: string;
  };
  receiver: {
    id: string;
    username: string;
  };
};

export default function FriendsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSummary[]>([]);
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequestEntry[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequestEntry[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFriendData();
  }, []);

  async function fetchFriendData() {
    setError("");
    try {
      const response = await fetch("/api/friends");
      const json = await response.json();

      if (response.ok) {
        setFriends(json.friends || []);
        setIncomingRequests(json.incomingRequests || []);
        setOutgoingRequests(json.outgoingRequests || []);
      } else {
        setError(json.error || "Failed to load friends.");
      }
    } catch {
      setError("Unable to load friends right now.");
    }
  }

  async function handleSearch() {
    if (!query || query.length < 2) {
      setError("Please enter at least 2 characters.");
      return;
    }

    setError("");
    setStatusMessage("");
    setLoading(true);

    try {
      const response = await fetch(`/api/friends/search?query=${encodeURIComponent(query)}`);
      const json = await response.json();

      if (response.ok) {
        setResults(json.results || []);
      } else {
        setError(json.error || "Search failed.");
      }
    } catch {
      setError("Unable to search right now.");
    } finally {
      setLoading(false);
    }
  }

  async function sendFriendRequest(recipientId: string) {
    setError("");
    setStatusMessage("Sending friend request...");

    try {
      const response = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId }),
      });
      const json = await response.json();

      if (response.ok) {
        setStatusMessage(json.message || "Friend request sent.");
        handleSearch();
        fetchFriendData();
      } else {
        setError(json.error || "Failed to send friend request.");
      }
    } catch {
      setError("Unable to send friend request right now.");
    }
  }

  async function respondToRequest(requestId: string, action: "accept" | "reject") {
    setError("");
    setStatusMessage(action === "accept" ? "Accepting request..." : "Rejecting request...");

    try {
      const response = await fetch("/api/friends/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });
      const json = await response.json();

      if (response.ok) {
        setStatusMessage(json.message || "Request updated.");
        fetchFriendData();
        handleSearch();
      } else {
        setError(json.error || "Failed to update request.");
      }
    } catch {
      setError("Unable to update request right now.");
    }
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Friends</h1>
            <p className="text-gray-600 mt-2">
              Search for friends, send requests, and manage incoming requests.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Search Users</h2>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search username..."
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            <button
              onClick={handleSearch}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              {loading ? "Searching..." : "Search"}
            </button>
            {statusMessage ? (
              <p className="text-sm text-blue-600 mt-4">{statusMessage}</p>
            ) : null}
            {error ? (
              <p className="text-sm text-red-600 mt-4">{error}</p>
            ) : null}
          </div>

          <div className="xl:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Search Results</h2>
              {results.length === 0 ? (
                <p className="text-gray-600">Search for a username to add a friend.</p>
              ) : (
                <div className="space-y-4">
                  {results.map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg border border-slate-200 p-4"
                    >
                      <div>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-slate-600">{user.status === "friend" ? "Already friends" : user.status === "requested" ? "Request sent" : user.status === "requestReceived" ? "Respond to request" : "No connection"}</p>
                      </div>
                      <div className="space-x-2">
                        {user.status === "none" ? (
                          <button
                            onClick={() => sendFriendRequest(user.id)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                          >
                            Add
                          </button>
                        ) : user.status === "requestReceived" ? (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                            Incoming request
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                            {user.status === "friend" ? "Friend" : "Requested"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Your Friends</h2>
              {friends.length === 0 ? (
                <p className="text-gray-600">You haven't added any friends yet.</p>
              ) : (
                <ul className="space-y-4">
                  {friends.map((entry) => (
                    <li key={entry.id} className="rounded-lg border border-slate-200 p-4">
                      <p className="font-semibold">{entry.friend.username}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Incoming Requests</h2>
              {incomingRequests.length === 0 ? (
                <p className="text-gray-600">No pending friend requests.</p>
              ) : (
                <div className="space-y-4">
                  {incomingRequests.map((request) => (
                    <div key={request.id} className="rounded-lg border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
                      <div>
                        <p className="font-semibold">{request.sender.username}</p>
                        <p className="text-sm text-slate-600">Sent you a friend request.</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => respondToRequest(request.id, "accept")}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => respondToRequest(request.id, "reject")}
                          className="rounded-lg bg-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-300 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Outgoing Requests</h2>
              {outgoingRequests.length === 0 ? (
                <p className="text-gray-600">No outgoing requests.</p>
              ) : (
                <ul className="space-y-4">
                  {outgoingRequests.map((request) => (
                    <li key={request.id} className="rounded-lg border border-slate-200 p-4">
                      <p className="font-semibold">{request.receiver.username}</p>
                      <p className="text-sm text-slate-600">Request pending</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
