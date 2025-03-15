"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { AnimeData, ApiResponse } from "@/components/api-anime/home/types";

// Basic loading component with pulse animation
const ComponentLoader = ({ label }: { label: string }) => (
  <div className="w-full py-8 flex justify-center items-center bg-gray-900/30 backdrop-blur-sm rounded-xl animate-pulse">
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-3"></div>
      <div className="text-sm font-medium text-indigo-300">{label}</div>
    </div>
  </div>
);

// Custom hook untuk memantau visibilitas elemen
function useOnScreen(rootMargin = "0px") {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin, threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [rootMargin]);

  return [ref, isVisible] as const;
}

// Lazy loading component wrapper
const LazyLoadComponent = ({
  children,
  id,
  margin = "200px",
}: {
  children: React.ReactNode;
  id: string;
  margin?: string;
}) => {
  const [ref, isVisible] = useOnScreen(margin);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    // Periksa apakah komponen sudah dimuat sebelumnya dalam session
    if (typeof window !== "undefined") {
      const loadedComponents = JSON.parse(
        sessionStorage.getItem("loadedComponents") || "{}"
      );
      if (loadedComponents[id]) {
        setSessionLoaded(true);
        setHasLoaded(true);
      }
    }
  }, [id]);

  useEffect(() => {
    if (isVisible && !hasLoaded) {
      setHasLoaded(true);

      // Simpan status komponen yang sudah dimuat ke session storage
      if (typeof window !== "undefined" && id) {
        const loadedComponents = JSON.parse(
          sessionStorage.getItem("loadedComponents") || "{}"
        );
        loadedComponents[id] = true;
        sessionStorage.setItem(
          "loadedComponents",
          JSON.stringify(loadedComponents)
        );
      }
    }
  }, [isVisible, hasLoaded, id]);

  return (
    <div ref={ref} className="w-full">
      {isVisible || hasLoaded || sessionLoaded ? (
        children
      ) : (
        <div className="w-full h-64 bg-gray-900/20 rounded-xl animate-shimmer"></div>
      )}
    </div>
  );
};

// Dynamically import components
const FeaturedSlider = dynamic(
  () => import("@/components/api-anime/home/FeaturedSlider"),
  {
    loading: () => <ComponentLoader label="Loading featured anime..." />,
    ssr: false,
  }
);

const LatestEpisodes = dynamic(
  () => import("@/components/api-anime/home/LatestEpisodes"),
  {
    loading: () => <ComponentLoader label="Loading latest episodes..." />,
    ssr: false,
  }
);

const OngoingAnime = dynamic(
  () => import("@/components/api-anime/home/OngoingAnime"),
  {
    loading: () => <ComponentLoader label="Loading ongoing anime..." />,
    ssr: false,
  }
);

const PopularAnime = dynamic(
  () => import("@/components/api-anime/home/PopularAnime"),
  {
    loading: () => <ComponentLoader label="Loading popular anime..." />,
    ssr: false,
  }
);

const RecentlyAdded = dynamic(
  () => import("@/components/api-anime/home/RecentlyAdded"),
  {
    loading: () => <ComponentLoader label="Loading recently added anime..." />,
    ssr: false,
  }
);

// Hook untuk menangani gambar dengan caching
const useImageCache = () => {
  const preloadImage = useCallback((src: string) => {
    if (!src || typeof window === "undefined") return;

    // Cek apakah gambar sudah ada di cache
    const cachedImages = JSON.parse(
      sessionStorage.getItem("cachedImages") || "{}"
    );
    if (cachedImages[src]) return; // Gambar sudah di-cache

    // Preload gambar dan simpan ke cache
    const img = new Image();
    img.onload = () => {
      cachedImages[src] = true;
      sessionStorage.setItem("cachedImages", JSON.stringify(cachedImages));
    };
    img.src = src;
  }, []);

  return { preloadImage };
};

const AnimeHome: React.FC = () => {
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataTimestamp, setDataTimestamp] = useState<number | null>(null);
  const { preloadImage } = useImageCache();

  // Fungsi untuk preload gambar penting
  const preloadCriticalImages = useCallback(
    (data: AnimeData) => {
      if (!data) return;

      // Preload gambar slider terlebih dahulu (paling terlihat)
      const sliderImages =
        data.slider?.slice(0, 2).map((item) => item.image) || [];

      // Preload beberapa episode terbaru
      const episodeImages =
        data.latestEpisodes?.slice(0, 4).map((item) => item.image) || [];

      // Gabungkan semua gambar penting
      const criticalImages = [...sliderImages, ...episodeImages];

      // Preload gambar-gambar
      criticalImages.forEach((src) => preloadImage(src));
    },
    [preloadImage]
  );

  const fetchAnimeData = useCallback(
    async (forceFetch = false) => {
      try {
        // Periksa data di session storage terlebih dahulu
        if (!forceFetch && typeof window !== "undefined") {
          const cachedData = sessionStorage.getItem("animeData");
          const timestamp = sessionStorage.getItem("animeDataTimestamp");

          if (cachedData && timestamp) {
            const parsedData = JSON.parse(cachedData);
            const parsedTimestamp = parseInt(timestamp, 10);
            const currentTime = new Date().getTime();

            // Gunakan cache jika data belum kadaluwarsa (5 menit)
            if (currentTime - parsedTimestamp < 5 * 60 * 1000) {
              setAnimeData(parsedData);
              setDataTimestamp(parsedTimestamp);
              setLoading(false);

              // Preload gambar-gambar penting
              setTimeout(() => {
                preloadCriticalImages(parsedData);
              }, 100);

              return;
            }
          }
        }

        const response = await fetch("/api/anime/home", {
          cache: "force-cache",
          headers: {
            "Cache-Control": "max-age=300", // Cache for 5 minutes
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success) {
          // Simpan waktu data di-fetch
          const timestamp = new Date().getTime();

          // Simpan data ke state
          setAnimeData(data.data);
          setDataTimestamp(timestamp);

          // Simpan data ke session storage
          if (typeof window !== "undefined") {
            sessionStorage.setItem("animeData", JSON.stringify(data.data));
            sessionStorage.setItem("animeDataTimestamp", timestamp.toString());
          }

          // Preload gambar-gambar penting
          setTimeout(() => {
            preloadCriticalImages(data.data);
          }, 100);
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
    },
    [preloadCriticalImages]
  );

  useEffect(() => {
    // Inisialisasi session storage untuk komponen & gambar jika belum ada
    if (typeof window !== "undefined") {
      if (!sessionStorage.getItem("loadedComponents")) {
        sessionStorage.setItem("loadedComponents", "{}");
      }
      if (!sessionStorage.getItem("cachedImages")) {
        sessionStorage.setItem("cachedImages", "{}");
      }
    }

    // Fetch data anime
    fetchAnimeData();

    // Event listener untuk refresh data ketika tab menjadi aktif lagi
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && dataTimestamp) {
        const currentTime = new Date().getTime();
        // Refresh data jika sudah lebih dari 5 menit
        if (currentTime - dataTimestamp > 5 * 60 * 1000) {
          fetchAnimeData(true); // Force fetch baru
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchAnimeData, dataTimestamp]);

  // Tambahkan event listener untuk caching gambar
  useEffect(() => {
    if (typeof window === "undefined") return;

    const setupImageCaching = () => {
      document.querySelectorAll("img").forEach((img) => {
        // Skip jika img sudah memiliki listener
        if (img.dataset.cached === "true") return;

        const src = img.getAttribute("src");
        if (!src) return;

        // Tambahkan kelas loading secara default
        img.classList.add("loading");

        // Periksa apakah gambar sudah di-cache
        const cachedImages = JSON.parse(
          sessionStorage.getItem("cachedImages") || "{}"
        );
        if (cachedImages[src]) {
          img.classList.remove("loading");
          img.classList.add("loaded");
        }

        // Tambahkan event listener load
        img.onload = function () {
          img.classList.remove("loading");
          img.classList.add("loaded");

          // Cache gambar ini di session storage
          cachedImages[src] = true;
          sessionStorage.setItem("cachedImages", JSON.stringify(cachedImages));
        };

        // Tandai sebagai sudah diproses
        img.dataset.cached = "true";
      });
    };

    // Setup initial caching
    setupImageCaching();

    // Setup MutationObserver to handle dynamically added images
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          setupImageCaching();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [animeData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 min-h-[50vh] bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4"></div>
          <div className="text-lg sm:text-xl font-medium bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Loading anime data...
          </div>
          {/* Skeleton placeholders untuk konten yang akan datang */}
          <div className="w-full max-w-6xl mx-auto mt-8 space-y-6">
            <div className="w-full h-64 bg-gray-800/20 rounded-xl animate-shimmer"></div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-2/3 h-48 bg-gray-800/20 rounded-xl animate-shimmer"></div>
              <div className="w-full md:w-1/3 h-48 bg-gray-800/20 rounded-xl animate-shimmer"></div>
            </div>
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
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchAnimeData(true);
              }}
              className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm transition-colors"
            >
              Try Again
            </button>
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
      {/* Background glow effects - reduced opacity for better performance */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-75">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-800/5 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-800/5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 space-y-8 sm:space-y-10">
        {/* Full width section for the featured slider */}
        <div className="w-full">
          <LazyLoadComponent id="featured-slider" margin="100px">
            <FeaturedSlider sliderData={animeData.slider} />
          </LazyLoadComponent>
        </div>

        {/* Content container with proper padding */}
        <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
          <div className="space-y-8 sm:space-y-10">
            {/* Latest Episodes (left) and Ongoing Anime (right) */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3">
                <LazyLoadComponent id="latest-episodes">
                  <LatestEpisodes episodes={animeData.latestEpisodes} />
                </LazyLoadComponent>
              </div>
              <div className="w-full lg:w-1/3 flex justify-end">
                <div className="w-full md:w-5/6 lg:w-full">
                  <LazyLoadComponent id="ongoing-anime">
                    <OngoingAnime animeList={animeData.ongoingAnime} />
                  </LazyLoadComponent>
                </div>
              </div>
            </div>

            {/* Recently Added (left) and Popular Anime (right) */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3">
                <LazyLoadComponent id="recently-added">
                  <RecentlyAdded animeList={animeData.recentlyAdded} />
                </LazyLoadComponent>
              </div>
              <div className="w-full lg:w-1/3 flex justify-end">
                <div className="w-full md:w-5/6 lg:w-full">
                  <LazyLoadComponent id="popular-anime">
                    <PopularAnime animeList={animeData.popularAnime} />
                  </LazyLoadComponent>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom optimized animations */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.1;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Image optimization styles */
        img {
          transition: opacity 0.3s ease-in-out;
        }
        img.loading {
          opacity: 0;
        }
        img.loaded {
          opacity: 1;
        }

        /* Optimized skeleton animation */
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .animate-shimmer {
          background: linear-gradient(
            to right,
            #1a103a 8%,
            #2a1a5a 18%,
            #1a103a 33%
          );
          background-size: 1000px 100%;
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default AnimeHome;
