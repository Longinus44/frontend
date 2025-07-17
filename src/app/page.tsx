"use client";

import { MapPin, Calendar, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ICoordinator } from "./interface/interface";
import { useEffect, useState } from "react";



export default function Home() {
  const [coordinators, setCoordinators] = useState<ICoordinator[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoordinators = async () => {
      const url = process.env.NEXT_PUBLIC_FETCH_COORDINATOR_URL;
      try {
        const res = await fetch(url as string, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch coordinators");
        }
        console.log("API URL:", process.env.NEXT_PUBLIC_FETCH_COORDINATOR_URL);

        const data = await res.json();
        setCoordinators(data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Fetch error:", err.message);
          setError(err.message)
        } else {
          console.error("Fetch error:", err);
          setError("An error occurred while fetching coordinators")
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCoordinators();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const filteredCoordinators = coordinators.filter((coordinator) =>
    `${coordinator.name} ${coordinator.location}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 py-10">
      <div className="container mx-auto px-4">
        {/* Header + Search + Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Event Coordinators</h1>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name or location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-white border border-gray-300 dark:border-gray-400 rounded px-4 py-2 w-full sm:w-72 text-foreground placeholder:text-foreground text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-muted hover:bg-muted/70 text-foreground"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>


        {/* Loading state */}
        {loading && <p>Loading coordinators...</p>}

        {/* Error state */}
        {error && <p className="text-red-500">Error: {error}</p>}


        {/* Coordinator Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoordinators.map((coordinator) => (
            <Link
              key={coordinator.id}
              href={`/coordinators/${coordinator.id}`}
              className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-white dark:bg-[#1e293b] dark:border-gray-700"
            >
              <div className="relative w-full h-48">
                <Image
                  src={coordinator.profilephoto}
                  alt={coordinator.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 space-y-2">
                <h2 className="text-xl text-blue-300 dark:text-white font-semibold">{coordinator.name}</h2>

                <div className="flex items-center text-sm  dark:text-blue-200">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{coordinator.location}</span>
                </div>

                <p className="text-sm text-blue-300 text-muted-foreground line-clamp-2">
                  {coordinator.bio}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-primary text-blue-200 font-bold text-lg">
                    ${coordinator.price.toLocaleString()}
                  </span>
                  <div className="flex items-center text-sm gap-1 text-blue-200">
                    <Calendar className="w-4 h-4" />
                    <span>{coordinator.availability.length} dates</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}



