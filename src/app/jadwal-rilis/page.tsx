"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Loader2Icon,
  PlayIcon,
  CalendarIcon,
  ClockIcon,
  FilmIcon,
  StarIcon,
} from "lucide-react";
import { ButtonLayout } from "@/components/Layout/Button";

// Types
interface AnimeItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  type: string;
  score: number | null;
  latestEpisode: string;
  releaseInfo: string;
}

interface ScheduleDay {
  day: string;
  anime: AnimeItem[];
}

interface ScheduleApiResponse {
  success: boolean;
  data: {
    schedules: ScheduleDay[];
  };
  message?: string;
}

export default function JadwalRilisPage() {
  const [scheduleData, setScheduleData] = useState<ScheduleDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
    hover: {
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/jadwal-rilis");

        if (!response.ok) {
          throw new Error(
            `Error: ${response.status} - Gagal terhubung ke server`
          );
        }

        const data: ScheduleApiResponse = await response.json();

        if (!data.success || !data.data) {
          throw new Error(
            data.message || "Data tidak tersedia. Periksa konfigurasi API"
          );
        }

        // Process image URLs to make them absolute if they're relative
        const processedScheduleData = data.data.schedules.map((day) => ({
          ...day,
          anime: day.anime.map((anime) => ({
            ...anime,
            image: anime.image.startsWith("//")
              ? `https:${anime.image}`
              : anime.image,
          })),
        }));

        setScheduleData(processedScheduleData);

        // Set the first day as active by default
        if (processedScheduleData.length > 0 && !activeDay) {
          setActiveDay(processedScheduleData[0].day);
        }
      } catch (error) {
        console.error("Error fetching schedule data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data jadwal anime"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [activeDay]);

  // Helper to get image URL with fallback
  const getImageUrl = (url: string) => {
    return url || "/placeholder-anime.jpg";
  };

  // Helper to translate day names to Indonesian
  const translateDay = (day: string) => {
    // Already in Indonesian from the API, but keeping this for flexibility
    return day;
  };

  // Filter anime by search query
  const filteredSchedule = scheduleData.map((day) => ({
    ...day,
    anime: day.anime.filter((anime) =>
      anime.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  // Get active day schedule
  const activeDaySchedule = filteredSchedule.find(
    (day) => day.day === activeDay
  );

  if (loading) {
    return (
      <ButtonLayout>
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
              Memuat jadwal rilis anime...
            </motion.p>
          </motion.div>
        </div>
      </ButtonLayout>
    );
  }

  if (error) {
    return (
      <ButtonLayout>
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
          </motion.div>
        </div>
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
            {/* Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Jadwal Rilis Anime
                </h1>
                <p className="text-gray-300">
                  Jadwal rilis episode terbaru anime yang sedang tayang.
                </p>
              </div>

              {/* Search input */}
              <div className="relative mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari anime..."
                  className="w-full py-3 px-4 pl-6 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white"
                />
              </div>

              {/* Day tabs */}
              <div className="flex items-center justify-start overflow-x-auto pb-4 gap-2 scrollbar-hide">
                {scheduleData.map((day) => (
                  <motion.button
                    key={day.day}
                    onClick={() => setActiveDay(day.day)}
                    className={`py-2 px-4 rounded-full flex items-center gap-2 whitespace-nowrap font-medium transition-colors ${
                      activeDay === day.day
                        ? "bg-purple-700 text-white"
                        : "bg-gray-800/70 text-gray-300 hover:bg-gray-700"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CalendarIcon size={16} />
                    <span>{translateDay(day.day)}</span>
                    <span className="bg-gray-700/50 text-xs py-1 px-2 rounded-full">
                      {day.anime.length}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Anime schedule list */}
            {activeDaySchedule && activeDaySchedule.anime.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {activeDaySchedule.anime.map((anime) => (
                  <motion.div
                    key={anime.id}
                    variants={itemVariants}
                    whileHover="hover"
                    className="bg-gray-900/30 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800/50 hover:border-purple-500/30"
                  >
                    <Link href={`/${anime.id}`}>
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                          <Image
                            src={getImageUrl(anime.image)}
                            alt={anime.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 192px"
                          />

                          {/* Type badge */}
                          <div className="absolute top-2 left-2 bg-purple-700/80 text-white text-xs py-1 px-2 rounded flex items-center gap-1">
                            <FilmIcon size={10} />
                            <span>{anime.type}</span>
                          </div>

                          {/* Episode badge */}
                          <div className="absolute bottom-2 left-2 bg-purple-700/90 text-white text-xs py-1 px-2 rounded flex items-center gap-1">
                            <PlayIcon size={10} />
                            <span>EP {anime.latestEpisode}</span>
                          </div>

                          {/* Score badge if available */}
                          {anime.score && (
                            <div className="absolute top-2 right-2 bg-gray-900/80 text-yellow-400 text-xs py-1 px-2 rounded flex items-center gap-1">
                              <StarIcon size={10} className="fill-yellow-400" />
                              <span>{anime.score.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-medium text-white text-lg mb-2 line-clamp-2 sm:line-clamp-1">
                            {anime.title}
                          </h3>

                          <div className="mt-auto pt-2">
                            <div className="flex flex-wrap gap-3">
                              <div className="text-sm text-gray-300 flex items-center gap-1">
                                <ClockIcon
                                  size={14}
                                  className="text-purple-400"
                                />
                                <span>{anime.releaseInfo}</span>
                              </div>
                              <div className="text-sm text-gray-300 flex items-center gap-1">
                                <PlayIcon
                                  size={14}
                                  className="text-purple-400"
                                />
                                <span>Episode {anime.latestEpisode}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center py-20 text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-xl mb-2">Tidak ada anime yang ditemukan</p>
                <p className="text-sm">
                  {searchQuery
                    ? "Coba gunakan kata kunci pencarian yang berbeda"
                    : "Tidak ada jadwal anime untuk hari ini"}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ButtonLayout>
  );
}
