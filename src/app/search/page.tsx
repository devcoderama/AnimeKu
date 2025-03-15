"use client";

import { ButtonLayout } from "@/components/Layout/Button";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, AlertCircle, Search, Film, TrendingUp } from "lucide-react";
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

// Loading component
const LoadingState = () => (
  <div className="flex justify-center items-center py-16 search-fade-in">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
      <div className="w-12 h-12 border-4 border-gray-300 border-b-purple-500 rounded-full animate-spin absolute top-2 left-2"></div>
    </div>
  </div>
);

// Error component
const ErrorState = ({ errorMessage }: { errorMessage: string }) => (
  <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 text-red-200 px-6 py-5 rounded-lg my-4 shadow-lg search-fade-in">
    <div className="flex items-center">
      <AlertCircle className="w-6 h-6 mr-3 text-red-400" />
      <span className="font-bold text-lg">Gagal mengambil data!</span>
    </div>
    <p className="mt-2 pl-9">{errorMessage}</p>
    <p className="mt-3 pl-9 text-red-300">
      Silakan coba lagi nanti atau periksa koneksi internet Anda.
    </p>
  </div>
);

// No Results component
const NoResultsState = ({ query }: { query: string }) => (
  <div className="flex flex-col items-center justify-center py-16 search-fade-in">
    <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-lg">
      <AlertCircle className="w-12 h-12 mb-4 mx-auto text-amber-300 animate-bounce" />
      <p className="text-center text-lg text-gray-200">
        Tidak ada hasil untuk{" "}
        <span className="font-bold">&ldquo;{query}&rdquo;</span>
      </p>
    </div>
  </div>
);

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

// Content component that uses useSearchParams
const SearchContent = () => {
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
    <div className="relative min-h-screen w-full">
      {/* Animated background elements - scoped to this component */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-indigo-400 rounded-full mix-blend-overlay filter blur-[100px] opacity-10 search-float"></div>
        <div className="absolute top-[40%] left-[60%] w-72 h-72 bg-purple-400 rounded-full mix-blend-overlay filter blur-[100px] opacity-10 search-float-delayed"></div>
        <div className="absolute top-[70%] left-[30%] w-80 h-80 bg-blue-400 rounded-full mix-blend-overlay filter blur-[100px] opacity-5 search-float-slow"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Animated search header */}
        <div className="search-fade-in mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 mb-4 bg-indigo-600/20 backdrop-blur-sm rounded-full">
            <Search className="w-6 h-6 text-indigo-300 search-pulse" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-100">
            Hasil Pencarian
          </h1>
          {query && (
            <div className="relative inline-block">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                &ldquo;{query}&rdquo;
              </h2>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded"></div>
            </div>
          )}
        </div>

        {/* Loading animation */}
        {isLoading && <LoadingState />}

        {/* Error message with improved styling */}
        {!isLoading && error && <ErrorState errorMessage={error} />}

        {/* No results message */}
        {!isLoading && !error && searchResult?.data?.anime?.length === 0 && (
          <NoResultsState query={query} />
        )}

        {/* Search results grid with animations */}
        {!isLoading &&
          !error &&
          searchResult?.data?.anime &&
          searchResult.data.anime.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {searchResult.data.anime.map((anime, index) => (
                <Link key={anime.id} href={anime.id}>
                  <div
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 search-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative group">
                      <div className="w-full h-64 relative">
                        <Image
                          src={
                            anime.image
                              ? anime.image.split("?")[0]
                              : "/placeholder-image.jpg"
                          }
                          alt={anime.title}
                          fill
                          priority={index === 0}
                          className="object-cover rounded-t-lg"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end justify-center p-4">
                        <div className="text-white text-center">
                          <p className="text-sm font-medium mb-2">
                            Lihat Detail
                          </p>
                          <div className="flex justify-center space-x-2">
                            <Film className="w-4 h-4 text-indigo-300" />
                            <Star className="w-4 h-4 text-amber-300" />
                            <TrendingUp className="w-4 h-4 text-emerald-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-sm line-clamp-2 text-gray-100 mb-2">
                        {anime.title}
                      </h3>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-xs text-amber-200">
                          <Star className="w-4 h-4 mr-1 fill-amber-300 stroke-amber-300" />
                          <span className="font-bold">
                            {anime.score || "N/A"}
                          </span>
                        </div>
                        <div className="text-xs">
                          <span className="px-2 py-1 bg-gray-700/70 rounded-full text-indigo-200 font-medium">
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
      </div>

      {/* Scoped CSS for animations - prefix classes to avoid conflicts */}
      <style jsx>{`
        @keyframes search-fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes search-float {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        @keyframes search-float-delayed {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(15px) translateX(-10px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        @keyframes search-float-slow {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(10px) translateX(15px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        @keyframes search-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        :global(.search-fade-in) {
          animation: search-fade-in 0.5s ease-out forwards;
        }

        :global(.search-float) {
          animation: search-float 8s ease-in-out infinite;
        }

        :global(.search-float-delayed) {
          animation: search-float-delayed 12s ease-in-out infinite;
        }

        :global(.search-float-slow) {
          animation: search-float-slow 15s ease-in-out infinite;
        }

        :global(.search-pulse) {
          animation: search-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Main component that wraps content with Suspense
export default function SearchPage() {
  return (
    <ButtonLayout>
      <Suspense fallback={<LoadingState />}>
        <SearchContent />
      </Suspense>
    </ButtonLayout>
  );
}
