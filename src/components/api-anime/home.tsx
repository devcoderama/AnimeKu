"use client";

import React, { useEffect, useState } from "react";
import { AnimeData, ApiResponse } from "@/components/api-anime/home/types";
import FeaturedSlider from "@/components/api-anime/home/FeaturedSlider";
import LatestEpisodes from "@/components/api-anime/home/LatestEpisodes";
import OngoingAnime from "@/components/api-anime/home/OngoingAnime";
import PopularAnime from "@/components/api-anime/home/PopularAnime";
import RecentlyAdded from "@/components/api-anime/home/RecentlyAdded";

const AnimeHome: React.FC = () => {
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const response = await fetch("/api/anime/home");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success) {
          setAnimeData(data.data);
        } else {
          throw new Error("Failed to fetch anime data");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 min-h-[50vh] bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4"></div>
          <div className="text-lg sm:text-xl font-medium bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Loading anime data...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border-l-4 border-red-500 p-4 sm:p-6 rounded-lg shadow-lg mx-4 md:mx-auto max-w-2xl my-6 sm:my-8 bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38]">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mb-2 sm:mb-0 sm:mr-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-red-400 mb-1">
              Error occurred
            </h2>
            <p className="text-red-300 text-sm sm:text-base">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!animeData) {
    return (
      <div className="py-8 sm:py-12 text-center bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-indigo-400 mb-3 sm:mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-base sm:text-xl font-medium text-indigo-300">
          No anime data available
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38]">
      {/* Background glow effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-800/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-800/10 blur-[120px]"></div>
      </div>

      <div className="relative z-10 space-y-8 sm:space-y-10">
        {/* Full width section for the featured slider */}
        <div className="w-full">
          <FeaturedSlider sliderData={animeData.slider} />
        </div>

        {/* Content container with proper padding */}
        <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
          <div className="space-y-8 sm:space-y-10">
            {/* Latest Episodes (left) and Ongoing Anime (right) - Stacked on mobile, side by side on larger screens */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3">
                <LatestEpisodes episodes={animeData.latestEpisodes} />
              </div>
              <div className="w-full lg:w-1/3 flex justify-end">
                <div className="w-full md:w-5/6 lg:w-full">
                  <OngoingAnime animeList={animeData.ongoingAnime} />
                </div>
              </div>
            </div>

            {/* Recently Added (left) and Popular Anime (right) - Stacked on mobile, side by side on larger screens */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3">
                <RecentlyAdded animeList={animeData.recentlyAdded} />
              </div>
              <div className="w-full lg:w-1/3 flex justify-end">
                <div className="w-full md:w-5/6 lg:w-full">
                  <PopularAnime animeList={animeData.popularAnime} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeHome;
