"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  Loader2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  TagIcon,
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
  type: string;
  score: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface GenreAnimeApiResponse {
  success: boolean;
  data: {
    anime: AnimeItem[];
    pagination: PaginationInfo;
  };
  pagination: PaginationInfo;
  message?: string;
}

export default function GenreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const genreSlug = params.slug as string;

  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genreName, setGenreName] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  useEffect(() => {
    const fetchAnimeByGenre = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/genres/${genreSlug}?page=${currentPage}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data: GenreAnimeApiResponse = await response.json();
        if (!data.success || !data.data) {
          throw new Error(data.message || "Data tidak tersedia");
        }

        // Remove resize parameter from image URLs
        const processedAnimeList = data.data.anime.map((anime) => ({
          ...anime,
          image: anime.image,
        }));

        setAnimeList(processedAnimeList);
        setPagination(data.pagination);

        // Format genre name from slug
        setGenreName(
          genreSlug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        );
      } catch (error) {
        console.error("Error fetching anime by genre:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data anime"
        );
      } finally {
        setLoading(false);
      }
    };

    if (genreSlug) {
      fetchAnimeByGenre();
    }
  }, [genreSlug, currentPage]);

  const handlePageChange = (page: number) => {
    router.push(`/genres/${genreSlug}?page=${page}`);
  };

  // Helper to get image URL with fallback
  const getImageUrl = (url: string) => {
    return url || "/placeholder-anime.jpg";
  };

  if (loading) {
    return (
      <ButtonLayout>
        <motion.div
          className="min-h-screen bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38] text-gray-100 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center">
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
              <Loader2Icon
                size={64}
                className="text-purple-500 animate-spin mb-4"
              />
            </motion.div>
            <motion.p
              className="text-lg text-purple-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Memuat anime...
            </motion.p>
          </div>
        </motion.div>
      </ButtonLayout>
    );
  }

  if (error) {
    return (
      <ButtonLayout>
        <motion.div
          className="min-h-screen bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38] text-gray-100 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-red-500/30">
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
              {error}
            </motion.p>
            <motion.button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Coba Lagi
            </motion.button>
          </div>
        </motion.div>
      </ButtonLayout>
    );
  }

  return (
    <ButtonLayout>
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
            {/* Header with back button and view mode toggle */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <Link href="/genres">
                  <motion.button
                    className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowLeftIcon size={20} />
                    <span>Kembali ke Genre</span>
                  </motion.button>
                </Link>

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

              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-purple-700/30 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 10,
                    }}
                  >
                    <TagIcon size={24} className="text-purple-300" />
                  </motion.div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {genreName}
                  </h1>
                </div>

                {pagination && (
                  <p className="text-gray-300">
                    Menampilkan {animeList.length} anime dari total{" "}
                    {pagination.totalItems} hasil
                  </p>
                )}
              </motion.div>
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
                      <Link href={anime.slug}>
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
                            <div className="absolute top-2 right-2 bg-gray-900/80 text-yellow-400 text-xs py-1 px-2 rounded flex items-center gap-1">
                              <StarIcon size={10} className="fill-yellow-400" />
                              <span>{anime.score.toFixed(1)}</span>
                            </div>
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
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-gray-400">
                  Tidak ada anime ditemukan untuk genre ini.
                </p>
              </motion.div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <motion.div
                className="mt-10 flex justify-center items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    pagination.hasPrevPage
                      ? "bg-gray-800 hover:bg-purple-700 text-white"
                      : "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                  }`}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <ChevronLeftIcon size={20} />
                </motion.button>

                <div className="px-4 py-2 bg-gray-800/70 rounded-full text-white">
                  Halaman {pagination.currentPage} dari {pagination.totalPages}
                </div>

                <motion.button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    pagination.hasNextPage
                      ? "bg-gray-800 hover:bg-purple-700 text-white"
                      : "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                  }`}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <ChevronRightIcon size={20} />
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ButtonLayout>
  );
}
