"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";

type SearchResult = {
  igdbId: number;
  title: string;
  coverImage?: string;
  genre?: string;
  platforms?: string;
  summary?: string;
};

type Console = {
  id: string;
  name: string;
};

type UserLibraryEntry = {
  id: string;
  game: {
    id: string;
    title: string;
    coverImage?: string;
    genre?: string;
    platforms?: string;
  };
  console: Console;
};

export default function GamesPage() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [library, setLibrary] = useState<UserLibraryEntry[]>([]);
  const [consoles, setConsoles] = useState<Console[]>([]);
  const [selectedConsoles, setSelectedConsoles] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    fetchLibrary();
    fetchConsoles();
  }, []);

  async function fetchLibrary() {
    try {
      const response = await fetch("/api/user/games");
      const json = await response.json();

      if (response.ok) {
        setLibrary(json.games || []);
      } else {
        setError(json.error || "Failed to load library");
      }
    } catch (err) {
      setError("Failed to load library");
    }
  }

  async function fetchConsoles() {
    try {
      const response = await fetch("/api/consoles");
      const json = await response.json();

      if (response.ok) {
        setConsoles(json.consoles || []);
      }
    } catch {
      setConsoles([]);
    }
  }

  async function handleSearch() {
    if (!query || query.length < 2) {
      setError("Please enter at least 2 characters to search.");
      return;
    }

    setError("");
    setStatusMessage("");
    setLoading(true);

    try {
      const response = await fetch(`/api/games/search?query=${encodeURIComponent(query)}`);
      const json = await response.json();

      if (response.ok) {
        setSearchResults(json.games || []);
        setStatusMessage(json.message || "");
      } else {
        setError(json.error || "Search failed");
      }
    } catch {
      setError("Unable to perform search right now.");
    } finally {
      setLoading(false);
    }
  }

  async function addGameToLibrary(game: SearchResult) {
    const consoleId = selectedConsoles[game.igdbId];
    if (!consoleId) {
      setError("Please select a console before adding a game.");
      return;
    }

    setError("");
    setStatusMessage("Adding game to your library...");

    try {
      const response = await fetch("/api/user/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          igdbId: game.igdbId,
          title: game.title,
          coverImage: game.coverImage,
          genre: game.genre,
          platforms: game.platforms,
          consoleId,
        }),
      });
      const json = await response.json();

      if (response.ok) {
        setStatusMessage("Game added to your library!");
        fetchLibrary();
      } else {
        setError(json.error || "Failed to add game to library.");
      }
    } catch {
      setError("Unable to add game right now.");
    }
  }

  function handleConsoleChange(gameId: number, consoleId: string) {
    setSelectedConsoles((current) => ({ ...current, [gameId]: consoleId }));
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">My Games</h1>
            <p className="text-gray-600 mt-2">
              Search IGDB and add games to your library with the console you play them on.
            </p>
          </div>
          <div className="space-y-2 w-full md:w-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                placeholder="Search for a game..."
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                onClick={handleSearch}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
            {statusMessage ? (
              <p className="text-sm text-blue-600">{statusMessage}</p>
            ) : null}
            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Search Results</h2>
              {searchResults.length === 0 ? (
                <p className="text-gray-600">Start a search to see games here.</p>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((game) => (
                    <div
                      key={game.igdbId}
                      className="grid gap-4 sm:grid-cols-[96px_minmax(0,_1fr)] lg:grid-cols-[96px_minmax(0,_1fr)_220px] items-center bg-slate-50 p-4 rounded-xl"
                    >
                      <div className="h-24 w-24 overflow-hidden rounded-lg bg-slate-200">
                        {game.coverImage ? (
                          <img
                            src={game.coverImage}
                            alt={game.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-slate-500">
                            No cover
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{game.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {game.genre || "Genre unavailable"} · {game.platforms || "Platforms unavailable"}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <select
                          aria-label="Choose console"
                          value={selectedConsoles[game.igdbId] || ""}
                          onChange={(event) => handleConsoleChange(game.igdbId, event.target.value)}
                          className="w-full rounded-lg border px-3 py-2"
                        >
                          <option value="">Choose console</option>
                          {consoles.map((console) => (
                            <option key={console.id} value={console.id}>
                              {console.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => addGameToLibrary(game)}
                          className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
                        >
                          Add to library
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Your Library</h2>
              {library.length === 0 ? (
                <p className="text-gray-600">You haven't added any games yet.</p>
              ) : (
                <ul className="space-y-4">
                  {library.map((entry) => (
                    <li key={entry.id} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 overflow-hidden rounded-lg bg-slate-200">
                          {entry.game.coverImage ? (
                            <img
                              src={entry.game.coverImage}
                              alt={entry.game.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-slate-500">
                              No cover
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{entry.game.title}</p>
                          <p className="text-sm text-gray-600 truncate">
                            {entry.console.name} · {entry.game.genre || "No genre"}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Available Consoles</h2>
              <div className="space-y-2">
                {consoles.map((console) => (
                  <div key={console.id} className="rounded-lg border border-slate-200 p-3">
                    {console.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
