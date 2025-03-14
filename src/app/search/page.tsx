"use client";

import { ButtonLayout } from "@/components/Layout/Button";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  AlertCircle,
  Search,
  Film,
  Award,
  Calendar,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

// Definisikan interface untuk data anime
interface AnimeItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  type: string;
  score: number;
}

// Interface untuk hasil pencarian API
interface SearchResult {
  success: boolean;
  data: {
    anime: AnimeItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Interface untuk hasil pencarian fungsi
interface SearchResponse {
  data: SearchResult | null;
  error: string | null;
}

async function searchAnime(query: string): Promise<SearchResponse> {
  try {
    // Memanggil API route lokal kita, bukan API eksternal langsung
    const response = await fetch(
      `/api/anime-search?q=${encodeURIComponent(query)}`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch search results");
    }

    return { data, error: null };
  } catch (error) {
    console.error("Search Error:", error);
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch search results and update query
  useEffect(() => {
    const searchQuery = searchParams.get("q") || "";

    const fetchSearchResults = async () => {
      if (searchQuery) {
        setQuery(searchQuery);
        setIsLoading(true);
        setError(null);

        const { data, error } = await searchAnime(searchQuery);

        setSearchResult(data);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  return (
    <ButtonLayout>
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 opacity-90 z-[-1]"></div>

      <div className="container mx-auto px-4 py-8">
        {/* Animated search header */}
        <div className="animate-fadeIn mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 mb-4 bg-indigo-600/30 backdrop-blur-sm rounded-full">
            <Search className="w-6 h-6 text-purple-300 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">
            Hasil Pencarian
          </h1>
          {query && (
            <div className="relative inline-block">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                "{query}"
              </h2>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded"></div>
            </div>
          )}
        </div>

        {/* Loading animation */}
        {isLoading && (
          <div className="flex justify-center items-center py-16 animate-fadeIn">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="w-12 h-12 border-4 border-purple-200 border-b-purple-500 rounded-full animate-spin absolute top-2 left-2"></div>
            </div>
          </div>
        )}

        {/* Error message with improved styling */}
        {!isLoading && error && (
          <div className="bg-red-900/40 backdrop-blur-sm border border-red-700 text-red-200 px-6 py-5 rounded-lg my-4 shadow-lg animate-fadeIn">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 mr-3 text-red-400" />
              <span className="font-bold text-lg">Gagal mengambil data!</span>
            </div>
            <p className="mt-2 pl-9">{error}</p>
            <p className="mt-3 pl-9 text-red-300">
              Silakan coba lagi nanti atau periksa koneksi internet Anda.
            </p>
          </div>
        )}

        {/* No results message */}
        {!isLoading && !error && searchResult?.data?.anime?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
            <div className="bg-indigo-800/30 backdrop-blur-sm p-6 rounded-xl border border-indigo-700/50 shadow-lg">
              <AlertCircle className="w-12 h-12 mb-4 mx-auto text-yellow-400 animate-bounce" />
              <p className="text-center text-lg text-yellow-200">
                Tidak ada hasil untuk{" "}
                <span className="font-bold">"{query}"</span>
              </p>
            </div>
          </div>
        )}

        {/* Search results grid with animations */}
        {!isLoading && !error && searchResult?.data?.anime?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {searchResult.data.anime.map((anime, index) => (
              <Link key={anime.id} href={anime.id}>
                <div
                  className="bg-indigo-900/40 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 animate-fadeIn"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative group">
                    <img
                      src={
                        anime.image
                          ? anime.image.split("?")[0]
                          : "/placeholder-image.jpg"
                      }
                      alt={anime.title}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/70 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end justify-center p-4">
                      <div className="text-white text-center">
                        <p className="text-sm font-medium mb-2">Lihat Detail</p>
                        <div className="flex justify-center space-x-2">
                          <Film className="w-4 h-4 text-cyan-300" />
                          <Star className="w-4 h-4 text-yellow-400" />
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm line-clamp-2 text-white mb-2">
                      {anime.title}
                    </h3>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-xs text-yellow-300">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 stroke-yellow-400" />
                        <span className="font-bold">
                          {anime.score || "N/A"}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="px-2 py-1 bg-indigo-700/60 rounded-full text-cyan-300 font-medium">
                          {anime.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination component */}
        {!isLoading && !error && searchResult?.data?.anime?.length > 0 && (
          <div className="mt-10 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm bg-indigo-800/30 backdrop-blur-sm p-1 border border-indigo-700/50">
              {searchResult.pagination.hasPrevPage && (
                <button className="px-4 py-2 text-sm font-medium text-purple-300 rounded-l-md hover:bg-indigo-700/50">
                  Previous
                </button>
              )}
              <span className="px-4 py-2 text-sm font-medium text-white bg-indigo-700/60 rounded-md">
                {searchResult.pagination.currentPage} of{" "}
                {searchResult.pagination.totalPages}
              </span>
              {searchResult.pagination.hasNextPage && (
                <button className="px-4 py-2 text-sm font-medium text-purple-300 rounded-r-md hover:bg-indigo-700/50">
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add custom animation keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </ButtonLayout>
  );
}
