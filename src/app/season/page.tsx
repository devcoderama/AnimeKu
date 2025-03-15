"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2Icon,
  CalendarIcon,
  ChevronDownIcon,
  StarIcon,
  FilmIcon,
  GridIcon,
  ListIcon,
} from "lucide-react";
import { ButtonLayout } from "@/components/Layout/Button";

// Types
interface AnimeItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  thumbnail?: string;
  type: string;
  score: number;
  synopsis?: string;
  status?: string;
  episodes?: number | null;
  released?: string;
  genres?: {
    id: string;
    slug: string;
    name: string;
  }[];
  rating?: string;
}

interface SeasonAnimeApiResponse {
  success: boolean;
  data: {
    anime: AnimeItem[];
    year?: string;
    season?: string;
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  message?: string;
}

interface SeasonListApiResponse {
  success: boolean;
  data: {
    seasons: string[];
  };
  message?: string;
}

// Loading component
const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38] text-gray-100 flex items-center justify-center">
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Loader2Icon size={64} className="text-purple-500 animate-spin mb-4" />
      </motion.div>
      <motion.p
        className="text-lg text-purple-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Memuat anime season...
      </motion.p>
    </motion.div>
  </div>
);

// Error component
const ErrorState = ({ errorMessage }: { errorMessage: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38] text-gray-100 p-6 flex items-center justify-center">
    <motion.div
      className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-red-500/30"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <motion.h1
        className="text-2xl font-bold text-red-400 mb-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        Error
      </motion.h1>
      <motion.p
        className="text-gray-300 mb-6"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {errorMessage}
      </motion.p>
      <motion.button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Coba Lagi
      </motion.button>
    </motion.div>
  </div>
);

// Main content component that uses useSearchParams
const SeasonContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const yearParam = searchParams.get("year");
  const seasonParam = searchParams.get("season");

  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
  const [availableSeasons, setAvailableSeasons] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(yearParam || "");
  const [selectedSeason, setSelectedSeason] = useState<string>(
    seasonParam || ""
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);

  // Map season names for display with capitalized first letter
  const formatSeasonName = (season: string) => {
    return season.charAt(0).toUpperCase() + season.slice(1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  // Fetch available seasons
  useEffect(() => {
    const fetchAvailableSeasons = async () => {
      try {
        const response = await fetch(`/api/season?list=true`);

        if (!response.ok) {
          throw new Error(
            `Error: ${response.status} - Gagal terhubung ke server`
          );
        }

        const data: SeasonListApiResponse = await response.json();

        if (!data.success || !data.data) {
          throw new Error(
            data.message || "Data tidak tersedia. Periksa konfigurasi API"
          );
        }

        setAvailableSeasons(data.data.seasons);

        // If no season is selected, set default from URL or first available
        if (!selectedYear || !selectedSeason) {
          if (data.data.seasons.length > 0) {
            const firstSeason = data.data.seasons[0];
            const [season, year] = firstSeason.split("-");

            if (!selectedSeason && seasonParam) {
              setSelectedSeason(seasonParam);
            } else if (!selectedSeason) {
              setSelectedSeason(season);
            }

            if (!selectedYear && yearParam) {
              setSelectedYear(yearParam);
            } else if (!selectedYear) {
              setSelectedYear(year);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching available seasons:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data season"
        );
      }
    };

    fetchAvailableSeasons();
  }, [yearParam, seasonParam, selectedYear, selectedSeason]);

  // Fetch anime list for selected season
  useEffect(() => {
    const fetchSeasonAnime = async () => {
      try {
        setLoading(true);

        // Only proceed if we have both year and season
        if (!selectedYear || !selectedSeason) {
          setAnimeList([]);
          setLoading(false);
          return;
        }

        // Use the season and year parameters for API request
        const response = await fetch(
          `/api/season?year=${selectedYear}&season=${selectedSeason}`
        );

        if (!response.ok) {
          throw new Error(
            `Error: ${response.status} - Gagal terhubung ke server`
          );
        }

        const data: SeasonAnimeApiResponse = await response.json();

        if (!data.success || !data.data) {
          throw new Error(
            data.message || "Data tidak tersedia. Periksa konfigurasi API"
          );
        }

        // Process image URLs to ensure they are complete
        const processedAnimeList = data.data.anime.map((anime) => {
          let imageUrl = anime.thumbnail || anime.image || "";

          // Remove resize parameters if present
          imageUrl = imageUrl.replace(/\?resize=\d+,\d+/, "");

          // Convert protocol-relative URLs to absolute URLs
          if (imageUrl.startsWith("//")) {
            imageUrl = `https:${imageUrl}`;
          }

          return {
            ...anime,
            image: imageUrl,
          };
        });

        setAnimeList(processedAnimeList);
      } catch (error) {
        console.error("Error fetching season anime:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data anime season"
        );
      } finally {
        setLoading(false);
      }
    };

    if (selectedYear && selectedSeason) {
      fetchSeasonAnime();
    }
  }, [selectedYear, selectedSeason]);

  // Update URL when selections change
  useEffect(() => {
    if (selectedYear && selectedSeason) {
      router.push(`/season?year=${selectedYear}&season=${selectedSeason}`);
    }
  }, [selectedYear, selectedSeason, router]);

  // Parse available seasons to extract years and seasons
  const uniqueYears = [
    ...new Set(
      availableSeasons.map((seasonStr) => {
        const [, year] = seasonStr.split("-");
        return year;
      })
    ),
  ].sort((a, b) => b.localeCompare(a));

  // Get unique seasons for the selected year
  const seasonsForYear = [
    ...new Set(
      availableSeasons
        .filter((seasonStr) => {
          const [, year] = seasonStr.split("-");
          return year === selectedYear;
        })
        .map((seasonStr) => {
          const [season] = seasonStr.split("-");
          return season;
        })
    ),
  ];

  // Helper to get image URL with fallback
  const getImageUrl = (url: string) => {
    if (!url) return "/placeholder-anime.jpg";

    // Convert protocol-relative URLs (starting with //) to absolute URLs
    if (url.startsWith("//")) {
      return `https:${url}`;
    }

    return url;
  };

  // Handle dropdown selections
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setYearDropdownOpen(false);

    // If the selected season is not available for this year, reset it
    const seasonExists = availableSeasons.some((s) => {
      const [season, yearFromSeason] = s.split("-");
      return yearFromSeason === year && season === selectedSeason;
    });

    if (!seasonExists) {
      const firstSeasonForYear =
        availableSeasons
          .filter((s) => {
            const [, yearFromSeason] = s.split("-");
            return yearFromSeason === year;
          })
          .map((s) => {
            const [season] = s.split("-");
            return season;
          })[0] || "";

      setSelectedSeason(firstSeasonForYear);
    }
  };

  const handleSeasonChange = (season: string) => {
    setSelectedSeason(season);
    setSeasonDropdownOpen(false);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState errorMessage={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38] text-gray-100 relative overflow-hidden">
      {/* Background glow effects */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-800/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-800/10 blur-[120px]"></div>
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with view mode toggle */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Anime{" "}
                {selectedSeason && selectedYear
                  ? `${formatSeasonName(selectedSeason)} ${selectedYear}`
                  : "Seasonal"}
              </h1>

              {/* View mode toggle */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-full ${
                    viewMode === "grid"
                      ? "bg-purple-700 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  <GridIcon size={20} />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-full ${
                    viewMode === "list"
                      ? "bg-purple-700 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  <ListIcon size={20} />
                </motion.button>
              </div>
            </div>

            {/* Season selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-4">
                {/* Year dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                    className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center gap-2"
                  >
                    <CalendarIcon size={16} />
                    <span>{selectedYear || "Tahun"}</span>
                    <ChevronDownIcon
                      size={16}
                      className={`transition-transform ${
                        yearDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {yearDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-20 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="max-h-60 overflow-y-auto">
                        {uniqueYears.map((year) => (
                          <button
                            key={year}
                            onClick={() => handleYearChange(year)}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                              selectedYear === year ? "bg-purple-700" : ""
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Season dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                    className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center gap-2"
                    disabled={!selectedYear}
                  >
                    <CalendarIcon size={16} />
                    <span>
                      {selectedSeason
                        ? formatSeasonName(selectedSeason)
                        : "Season"}
                    </span>
                    <ChevronDownIcon
                      size={16}
                      className={`transition-transform ${
                        seasonDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {seasonDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-20 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                    >
                      {seasonsForYear.map((season) => (
                        <button
                          key={season}
                          onClick={() => handleSeasonChange(season)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                            selectedSeason === season ? "bg-purple-700" : ""
                          }`}
                        >
                          {formatSeasonName(season)}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {animeList.length > 0 && (
                <p className="text-gray-300 ml-auto">
                  Menampilkan {animeList.length} anime
                </p>
              )}
            </div>
          </motion.div>

          {/* Anime grid/list */}
          {animeList.length > 0 ? (
            <AnimatePresence>
              <motion.div
                className={`
                  ${
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                      : "space-y-4"
                  }
                `}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {animeList.map((anime) => (
                  <motion.div
                    key={anime.id}
                    variants={itemVariants}
                    whileHover="hover"
                    className={`
                      ${
                        viewMode === "list"
                          ? "flex items-center bg-gray-900/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50 hover:border-purple-500/30"
                          : ""
                      }
                    `}
                  >
                    <Link href={`${anime.id}`}>
                      <div
                        className={`
                        bg-gray-900/30 backdrop-blur-sm rounded-lg overflow-hidden 
                        border border-gray-800/50 hover:border-purple-500/30 
                        transition-all duration-300 transform hover:-translate-y-1 
                        hover:shadow-lg hover:shadow-purple-900/20 
                        ${
                          viewMode === "list"
                            ? "flex items-center w-full"
                            : "h-full flex flex-col"
                        }
                      `}
                      >
                        <div
                          className={`
                          relative overflow-hidden 
                          ${
                            viewMode === "grid"
                              ? "aspect-[2/3]"
                              : "w-32 h-48 mr-4 flex-shrink-0"
                          }
                        `}
                        >
                          <Image
                            src={getImageUrl(anime.image)}
                            alt={anime.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          />

                          {/* Type badge */}
                          <div className="absolute top-2 left-2 bg-purple-700/80 text-white text-xs py-1 px-2 rounded flex items-center gap-1">
                            <FilmIcon size={10} />
                            <span>{anime.type}</span>
                          </div>

                          {/* Score badge */}
                          {anime.score && (
                            <div className="absolute top-2 right-2 bg-gray-900/80 text-yellow-400 text-xs py-1 px-2 rounded flex items-center gap-1">
                              <StarIcon size={10} className="fill-yellow-400" />
                              <span>{anime.score.toFixed(1)}</span>
                            </div>
                          )}

                          {/* Episode badge if available */}
                          {anime.episodes && (
                            <div className="absolute bottom-2 left-2 bg-purple-700/90 text-white text-xs py-1 px-2 rounded">
                              {anime.episodes} EP
                            </div>
                          )}

                          {/* Status badge if available */}
                          {anime.status && (
                            <div className="absolute bottom-2 right-2 bg-gray-900/80 text-white text-xs py-1 px-2 rounded">
                              {anime.status}
                            </div>
                          )}
                        </div>

                        <div
                          className={`
                          p-3 flex-1 flex flex-col justify-between 
                          ${viewMode === "list" ? "ml-4 w-full" : ""}
                        `}
                        >
                          <h3
                            className={`
                            font-medium text-white 
                            ${
                              viewMode === "grid"
                                ? "text-sm line-clamp-2"
                                : "text-base"
                            }
                            hover:text-purple-300 transition-colors
                          `}
                          >
                            {anime.title}
                          </h3>

                          {/* Additional info for list view */}
                          {viewMode === "list" && (
                            <div className="mt-2">
                              {/* Genres */}
                              {anime.genres && anime.genres.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {anime.genres.slice(0, 3).map((genre) => (
                                    <span
                                      key={genre.id}
                                      className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded"
                                    >
                                      {genre.name}
                                    </span>
                                  ))}
                                  {anime.genres.length > 3 && (
                                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                                      +{anime.genres.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Synopsis excerpt */}
                              {anime.synopsis && (
                                <p className="text-gray-400 text-sm line-clamp-2">
                                  {anime.synopsis}
                                </p>
                              )}

                              {/* Info row */}
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                {anime.released && (
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon size={14} />
                                    {anime.released}
                                  </span>
                                )}
                                {anime.episodes && (
                                  <span>{anime.episodes} EP</span>
                                )}
                                {anime.status && <span>{anime.status}</span>}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">
                {selectedYear && selectedSeason
                  ? `Tidak ada anime ditemukan untuk ${formatSeasonName(
                      selectedSeason
                    )} ${selectedYear}`
                  : "Pilih tahun dan musim untuk melihat daftar anime"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main component that wraps content with Suspense
export default function SeasonPage() {
  return (
    <ButtonLayout>
      <Suspense fallback={<LoadingState />}>
        <SeasonContent />
      </Suspense>
    </ButtonLayout>
  );
}
