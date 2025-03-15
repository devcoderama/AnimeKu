"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Tag,
  Loader2,
  Swords,
  Compass,
  SmilePlus,
  Flame,
  Wand2,
  Skull,
  Globe,
  Sparkles,
  Cog,
  Search,
  Heart,
  GraduationCap,
  Rocket,
  Coffee,
  Trophy,
  Zap,
  LucideIcon,
} from "lucide-react";
import { ButtonLayout } from "@/components/Layout/Button";

// Types
interface Genre {
  id: string;
  slug: string;
  name: string;
}

interface GenreApiResponse {
  success: boolean;
  data: {
    genres: Genre[];
  };
  message?: string;
}

// Define a type for the genre icon mapping
type GenreIconMap = {
  [key: string]: LucideIcon;
  action: LucideIcon;
  adventure: LucideIcon;
  comedy: LucideIcon;
  drama: LucideIcon;
  fantasy: LucideIcon;
  horror: LucideIcon;
  isekai: LucideIcon;
  magic: LucideIcon;
  mecha: LucideIcon;
  mystery: LucideIcon;
  romance: LucideIcon;
  school: LucideIcon;
  "sci-fi": LucideIcon;
  "slice-of-life": LucideIcon;
  sports: LucideIcon;
  supernatural: LucideIcon;
  default: LucideIcon;
};

// Icon mapping for each genre
const genreIcons: GenreIconMap = {
  action: Swords,
  adventure: Compass,
  comedy: SmilePlus,
  drama: Flame,
  fantasy: Wand2,
  horror: Skull,
  isekai: Globe,
  magic: Sparkles,
  mecha: Cog,
  mystery: Search,
  romance: Heart,
  school: GraduationCap,
  "sci-fi": Rocket,
  "slice-of-life": Coffee,
  sports: Trophy,
  supernatural: Zap,
  // Default icon for any missing genres
  default: Tag,
};

// Get appropriate icon for a genre
const getGenreIcon = (slug: string) => {
  const IconComponent = genreIcons[slug] || genreIcons.default;
  return IconComponent;
};

// Random color combos for cards
const colorCombos = [
  "from-purple-500/10 to-blue-500/10",
  "from-blue-500/10 to-cyan-500/10",
  "from-indigo-500/10 to-purple-500/10",
  "from-pink-500/10 to-purple-500/10",
  "from-orange-500/10 to-pink-500/10",
  "from-green-500/10 to-emerald-500/10",
  "from-teal-500/10 to-blue-500/10",
  "from-violet-500/10 to-indigo-500/10",
];

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Use reduced motion for accessibility and mobile performance
  const shouldReduceMotion = useReducedMotion();

  // Check if we're on a mobile device (will run only on client-side)
  const [isMobile, setIsMobile] = useState(false);

  // Update mobile state on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Animation variants optimized for mobile
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.02 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: isMobile ? 50 : 100,
      },
    },
  };

  // Simplified animations for mobile devices
  const getFloatAnimation = () => {
    if (shouldReduceMotion || isMobile) {
      return {
        initial: { y: 0 },
        animate: { y: 0 },
      };
    }

    return {
      initial: { y: 0 },
      animate: {
        y: [0, -10, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    };
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/genres");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data: GenreApiResponse = await response.json();
        if (!data.success || !data.data) {
          throw new Error(data.message || "Data tidak tersedia");
        }

        setGenres(data.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  // Filter genres based on search term
  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <ButtonLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38] text-gray-100 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="relative w-20 h-20"
            >
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md"></div>
              <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-purple-500 animate-spin"></div>
              <div className="absolute inset-4 flex items-center justify-center">
                <Tag className="text-purple-300" />
              </div>
            </motion.div>
            <motion.p
              className="text-lg text-purple-300 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Memuat genre anime...
            </motion.p>
            <motion.div
              className="w-48 h-1 bg-gray-800 mt-4 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "12rem" }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                }}
              />
            </motion.div>
          </div>
        </div>
      </ButtonLayout>
    );
  }

  if (error) {
    return (
      <ButtonLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38] text-gray-100 p-6">
          <motion.div
            className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-red-500/30 shadow-lg"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center"
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 5, -5, 5, 0] }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
              >
                <Skull size={30} className="text-red-400" />
              </motion.div>
            </motion.div>

            <motion.h1
              className="text-2xl font-bold text-red-400 mb-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Error
            </motion.h1>

            <motion.p
              className="text-gray-300 mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {error}
            </motion.p>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-600/25 flex items-center gap-2 transform hover:scale-105"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 size={18} />
                </motion.div>
                <span>Coba Lagi</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </ButtonLayout>
    );
  }

  // Create optimized background glow components
  const BackgroundGlows = () => {
    if (isMobile) {
      // Simplified static background for mobile
      return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-800/10 blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-800/10 blur-[120px]" />
        </div>
      );
    }

    return (
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-800/10 blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-800/10 blur-[120px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-pink-800/10 blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </div>
    );
  };

  return (
    <ButtonLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38] text-gray-100">
        {/* Optimized background effects */}
        <BackgroundGlows />

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="mb-2"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md"></div>
                    <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/30 flex items-center justify-center">
                      <motion.div
                        variants={getFloatAnimation()}
                        initial="initial"
                        animate="animate"
                      >
                        <Tag size={26} className="text-purple-300" />
                      </motion.div>
                    </div>
                  </div>
                  <motion.h1
                    className="text-3xl md:text-5xl font-bold text-white bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Genre Anime
                  </motion.h1>
                </div>
              </motion.div>

              <motion.p
                className="text-gray-300 max-w-2xl mx-auto text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Telusuri anime berdasarkan genre favorit Anda. Klik pada genre
                untuk melihat daftar anime.
              </motion.p>

              {/* Search input */}
              <motion.div
                className="mt-8 max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div
                  className={`relative transition-all duration-300 ${
                    isSearchFocused && !isMobile ? "scale-105" : "scale-100"
                  }`}
                >
                  <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-md"></div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Cari genre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="w-full py-3 px-5 pl-12 bg-gray-900/60 border border-purple-500/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm"
                    />
                    <Search
                      size={18}
                      className="absolute left-4 text-gray-400"
                    />
                    {searchTerm && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={() => setSearchTerm("")}
                        className="absolute right-4 text-gray-400 hover:text-gray-200"
                      >
                        ×
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: isMobile ? 0.01 : 0.08 }}
            >
              {filteredGenres.length > 0 ? (
                filteredGenres.map((genre, index) => {
                  const IconComponent = getGenreIcon(genre.slug);
                  const colorIndex = index % colorCombos.length;
                  const gradientColors = colorCombos[colorIndex];

                  // Prepare icon animation based on device
                  const iconAnimation =
                    isMobile || shouldReduceMotion
                      ? {} // No animation on mobile
                      : {
                          animate: { rotate: [0, 5, 0, -5, 0] },
                          transition: {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        };

                  // Simplified orb animation for mobile
                  const orbAnimation =
                    isMobile || shouldReduceMotion
                      ? {} // No animation on mobile
                      : {
                          animate: {
                            y: [0, -8, 0],
                            opacity: [0.4, 0.8, 0.4],
                          },
                          transition: {
                            duration: 3,
                            repeat: Infinity,
                            delay: (index * 0.2) % 1.5,
                          },
                        };

                  return (
                    <motion.div key={genre.id} variants={itemVariants}>
                      <Link href={`/genres/${genre.slug}`}>
                        <motion.div
                          className={`bg-gradient-to-br ${gradientColors} backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 h-full hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 group shadow-md hover:shadow-lg hover:shadow-purple-500/10`}
                          whileHover={isMobile ? {} : { scale: 1.03 }}
                          whileTap={isMobile ? {} : { scale: 0.98 }}
                        >
                          <div className="flex flex-col items-center text-center">
                            <div className="relative">
                              <div className="w-16 h-16 rounded-full bg-purple-700/30 flex items-center justify-center mb-4 group-hover:bg-purple-600/40 transition-colors">
                                <motion.div
                                  {...iconAnimation}
                                  className="text-purple-300 group-hover:text-purple-200"
                                >
                                  <IconComponent size={28} />
                                </motion.div>
                              </div>

                              {/* Small floating orbs - hidden on mobile */}
                              {!isMobile && (
                                <motion.div
                                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500/40"
                                  {...orbAnimation}
                                />
                              )}
                            </div>

                            <h3 className="font-semibold text-white text-lg group-hover:text-purple-200 transition-colors">
                              {genre.name}
                            </h3>

                            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="text-xs text-purple-300 px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-sm">
                                Explore
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  className="col-span-full flex flex-col items-center justify-center py-12 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="w-20 h-20 mb-4 text-gray-400"
                    animate={
                      isMobile
                        ? {}
                        : {
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, 0, -5, 0],
                          }
                    }
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Search size={48} />
                  </motion.div>
                  <p className="text-gray-400 text-lg">
                    Tidak ada genre ditemukan dengan kata kunci &quot;
                    {searchTerm}&quot;
                  </p>
                  <motion.button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 text-purple-400 hover:text-purple-300 underline"
                    whileHover={isMobile ? {} : { scale: 1.05 }}
                    whileTap={isMobile ? {} : { scale: 0.95 }}
                  >
                    Reset pencarian
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </ButtonLayout>
  );
}
