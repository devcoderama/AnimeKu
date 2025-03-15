"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Film,
  Calendar,
  Clock,
  Eye,
  Info,
  Share2,
  Heart,
  BookmarkPlus,
  AlertTriangle,
} from "lucide-react";
import { ButtonLayout } from "@/components/Layout/Button";
import { StreamingDownloadPanel } from "@/components/api-anime/nonton/streaming-download";
import { VideoPlayer } from "@/components/api-anime/nonton/video-player";
import { motion, AnimatePresence } from "framer-motion";

// Types
import { EpisodeData, ApiResponse } from "@/types/anime";

// Loading component
const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38] text-gray-100 flex items-center justify-center">
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-16 h-16 border-4 border-t-transparent border-purple-500 rounded-full animate-spin mb-6"></div>
      <motion.p
        className="text-xl text-purple-300 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Memuat video...
      </motion.p>
      <motion.div
        className="mt-4 w-48 h-2 bg-gray-800 rounded-full overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: "12rem" }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
        />
      </motion.div>
    </motion.div>
  </div>
);

// Content component that uses useSearchParams
const WatchPageContent = () => {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const [isFullInfoVisible, setIsFullInfoVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const [episodeData, setEpisodeData] = useState<EpisodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");
  const [isHLS, setIsHLS] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  useEffect(() => {
    const fetchEpisodeData = async () => {
      if (!url) {
        setError("URL episode tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/nonton?url=${url}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = (await response.json()) as ApiResponse;

        if (!result.success || !result.data) {
          throw new Error(result.message || "Data episode tidak tersedia");
        }

        setEpisodeData(result.data);

        // Periksa apakah main source adalah m3u8
        const mainSource = result.data.sources.main;
        if (mainSource.includes(".m3u8")) {
          // Cari server alternatif (mp4upload, doodstream, dll)
          const alternativeServer = findAlternativeServer(result.data.sources);
          if (alternativeServer) {
            // Gunakan server alternatif jika tersedia
            setCurrentVideoUrl(alternativeServer.url);
            setIsHLS(false);
          } else {
            // Jika tidak ada alternatif, gunakan HLS player
            setCurrentVideoUrl(mainSource);
            setIsHLS(true);
          }
        } else {
          // Jika bukan m3u8, gunakan main source
          setCurrentVideoUrl(mainSource);
          setIsHLS(false);
        }
      } catch (error) {
        console.error("Error fetching episode data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeData();
  }, [url]);

  // Fungsi untuk menemukan server alternatif jika main source adalah m3u8
  const findAlternativeServer = (sources: EpisodeData["sources"]) => {
    // Prioritas server alternatif
    const serverPriority = [
      "mp4upload",
      "doodstream",
      "krakenfiles",
      "filelions",
      "pixeldrain",
    ];

    // Cari di kualitas 720p (kualitas standar)
    const embedSources = sources.embed.v720p;

    for (const server of serverPriority) {
      const serverUrl = embedSources[server as keyof typeof embedSources];
      if (serverUrl) {
        return { server, url: serverUrl };
      }
    }

    // Jika tidak ada server di 720p, coba di 480p
    const embedSources480 = sources.embed.v480p;
    for (const server of serverPriority) {
      const serverUrl = embedSources480[server as keyof typeof embedSources480];
      if (serverUrl) {
        return { server, url: serverUrl };
      }
    }

    return null;
  };

  // Handle perubahan sumber video dari panel kontrol
  const handleVideoSourceChange = (
    url: string,
    isHLSSource: boolean = false
  ) => {
    setCurrentVideoUrl(url);
    setIsHLS(isHLSSource);
  };

  const handleShareClick = () => {
    if (navigator.share && episodeData) {
      navigator
        .share({
          title: `${episodeData.animeTitle} - ${episodeData.episodeTitle}`,
          url: window.location.href,
        })
        .catch(() => {
          setShowShareTooltip(true);
          setTimeout(() => setShowShareTooltip(false), 2000);
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !episodeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38] text-gray-100 p-6">
        <motion.div
          className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-red-500/30 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-red-500/20 p-3 rounded-full">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-red-400">Error</h1>
          </div>
          <p className="text-gray-300 mb-8 text-lg">
            {error || "Data episode tidak tersedia"}
          </p>
          <Link href="/" className="inline-block">
            <button className="px-5 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all shadow-lg hover:shadow-purple-500/25 flex items-center gap-2">
              <ArrowLeft size={18} />
              <span>Kembali ke Beranda</span>
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38] text-gray-100">
      {/* Background glow effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-800/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-800/10 blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-pink-800/10 blur-[100px] animate-pulse"></div>
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-4 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player dan Info Container - 3/4 width pada desktop */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            variants={itemVariants}
          >
            {/* Video Player Container */}
            <div className="relative aspect-video bg-black/60 backdrop-blur rounded-xl overflow-hidden shadow-2xl border border-purple-500/20">
              {currentVideoUrl ? (
                <VideoPlayer
                  src={currentVideoUrl}
                  title={`${episodeData.animeTitle} ${episodeData.episodeTitle}`}
                  isHLS={isHLS}
                  sources={episodeData.sources}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Play size={48} className="text-purple-400/60 mb-3" />
                  <p className="text-purple-200">Sumber video tidak tersedia</p>
                </div>
              )}

              {/* Floating action buttons */}
              <div className="absolute top-3 right-3 flex space-x-2">
                <button
                  onClick={() => setIsFullInfoVisible(!isFullInfoVisible)}
                  className="w-9 h-9 bg-gray-900/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                  title="Lihat Informasi"
                >
                  <Info size={18} className="text-gray-200" />
                </button>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors ${
                    isLiked
                      ? "bg-red-500/30 text-red-400"
                      : "bg-gray-900/60 text-gray-200 hover:bg-gray-800"
                  }`}
                  title="Suka"
                >
                  <Heart size={18} className={isLiked ? "fill-red-400" : ""} />
                </button>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors ${
                    isBookmarked
                      ? "bg-purple-500/30 text-purple-400"
                      : "bg-gray-900/60 text-gray-200 hover:bg-gray-800"
                  }`}
                  title="Bookmark"
                >
                  <BookmarkPlus
                    size={18}
                    className={isBookmarked ? "fill-purple-400" : ""}
                  />
                </button>
                <div className="relative">
                  <button
                    onClick={handleShareClick}
                    className="w-9 h-9 bg-gray-900/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                    title="Share"
                  >
                    <Share2 size={18} className="text-gray-200" />
                  </button>

                  {/* Share tooltip */}
                  <AnimatePresence>
                    {showShareTooltip && (
                      <motion.div
                        className="absolute top-full mt-2 right-0 text-xs bg-gray-800 text-white py-1 px-2 rounded shadow-lg whitespace-nowrap"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        Link disalin!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Episode Info */}
            <motion.div
              className={`bg-gray-900/40 backdrop-blur-sm p-5 rounded-xl border border-purple-500/20 transition-all duration-300 ${
                isFullInfoVisible ? "h-auto" : "h-auto"
              }`}
              variants={itemVariants}
            >
              <div className="flex items-start gap-5">
                <div className="hidden sm:block w-28 h-28 relative rounded-lg overflow-hidden flex-shrink-0 border border-purple-500/30 shadow-lg">
                  <Image
                    src={episodeData.image}
                    alt={episodeData.animeTitle}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {episodeData.title}
                  </h2>
                  <p className="text-purple-300 text-sm mb-3">
                    {episodeData.animeTitle}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Film size={16} className="text-blue-400" />
                      <span className="text-gray-300">{episodeData.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-400" />
                      <span className="text-gray-300">24 menit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-blue-400" />
                      <span className="text-gray-300">
                        {episodeData.postedAt}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-blue-400" />
                      <span className="text-gray-300">1.2K views</span>
                    </div>
                  </div>

                  {isFullInfoVisible && (
                    <motion.div
                      className="mt-4 text-gray-300 text-sm leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Praesent euismod, nisl eget efficitur tincidunt, nisl
                        nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.
                        Donec euismod, nisl eget.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsFullInfoVisible(!isFullInfoVisible)}
                className="text-xs text-purple-400 hover:text-purple-300 mt-3 flex items-center gap-1 transition-colors"
              >
                {isFullInfoVisible ? "Sembunyikan info" : "Lihat lebih banyak"}
                <motion.div
                  animate={{ rotate: isFullInfoVisible ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight size={12} />
                </motion.div>
              </button>
            </motion.div>
          </motion.div>

          {/* Video Controls Panel - 1/4 width pada desktop */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <StreamingDownloadPanel
              sources={episodeData.sources}
              videoTitle={`${episodeData.animeTitle} ${episodeData.episodeTitle}`}
              onVideoSourceChange={handleVideoSourceChange}
            />
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <motion.div
          className="mt-12 flex justify-between items-center max-w-5xl mx-auto"
          variants={itemVariants}
        >
          <div className="w-1/3 flex justify-start">
            {episodeData.prevEpisode ? (
              <Link href={`/nonton?url=${episodeData.prevEpisode}`}>
                <motion.div
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg transition-all duration-300 group relative overflow-hidden bg-gray-900/60 backdrop-blur-sm border border-gray-700/50"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* RGB background effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -inset-[100%] opacity-20 animate-rgb-shift pointer-events-none bg-[conic-gradient(from_0deg,#ff0000,#ff9900,#33ff00,#0099ff,#6600ff,#ff0099,#ff0000)]"></div>
                  </div>

                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>

                  <motion.div
                    className="p-2 bg-purple-500/20 rounded-full relative z-10"
                    whileHover={{ rotate: -15, x: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ArrowLeft size={20} className="text-purple-300" />
                  </motion.div>
                  <span className="hidden sm:inline font-medium text-white relative z-10">
                    Episode Sebelumnya
                  </span>
                  <span className="sm:hidden font-medium text-white relative z-10">
                    Prev
                  </span>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 w-full h-full"
                    initial={{ backgroundPosition: "200% 0" }}
                    whileHover={{ backgroundPosition: "-200% 0" }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                      zIndex: 5,
                    }}
                  />
                </motion.div>
              </Link>
            ) : (
              <div></div>
            )}
          </div>

          {/* Kembali ke detail anime button in the center */}
          <div className="w-1/3 flex justify-center">
            <Link href={`/anime/${episodeData.animeSlug}`}>
              <motion.div
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl shadow-lg text-center relative overflow-hidden bg-gray-900/60 backdrop-blur-sm border border-gray-700/50"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(172, 148, 250, 0.35)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* RGB background effect with different animation */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -inset-[100%] opacity-25 animate-rgb-pulse pointer-events-none bg-[radial-gradient(circle,#ff0099,#6600ff,#0099ff,#33ff00,#ff9900,#ff0000)]"></div>
                </div>

                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>

                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    },
                  }}
                  className="relative z-10"
                >
                  <span className="hidden sm:inline font-medium text-white">
                    Kembali ke detail anime
                  </span>
                  <span className="sm:hidden font-medium text-white">
                    Detail Anime
                  </span>
                </motion.div>

                {/* Glow border effect */}
                <motion.div
                  className="absolute -inset-[1px] rounded-xl z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    boxShadow: [
                      "0 0 0px 0px rgba(139,92,246,0)",
                      "0 0 8px 1px rgba(139,92,246,0.6)",
                      "0 0 0px 0px rgba(139,92,246,0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </Link>
          </div>

          <div className="w-1/3 flex justify-end">
            {episodeData.nextEpisode ? (
              <Link href={`/nonton?url=${episodeData.nextEpisode}`}>
                <motion.div
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg transition-all duration-300 group relative overflow-hidden bg-gray-900/60 backdrop-blur-sm border border-gray-700/50"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* RGB background effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -inset-[100%] opacity-20 animate-rgb-shift-reverse pointer-events-none bg-[conic-gradient(from_0deg,#ff0000,#ff0099,#6600ff,#0099ff,#33ff00,#ff9900,#ff0000)]"></div>
                  </div>

                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>

                  <span className="hidden sm:inline font-medium text-white relative z-10">
                    Episode Selanjutnya
                  </span>
                  <span className="sm:hidden font-medium text-white relative z-10">
                    Next
                  </span>
                  <motion.div
                    className="p-2 bg-purple-500/20 rounded-full relative z-10"
                    whileHover={{ rotate: 15, x: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ArrowRight size={20} className="text-purple-300" />
                  </motion.div>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 w-full h-full"
                    initial={{ backgroundPosition: "-200% 0" }}
                    whileHover={{ backgroundPosition: "200% 0" }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                      zIndex: 5,
                    }}
                  />
                </motion.div>
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Main component wrapping with Suspense
const WatchPage = () => {
  return (
    <ButtonLayout>
      <Suspense fallback={<LoadingState />}>
        <WatchPageContent />
      </Suspense>

      {/* Global styles for player animations */}
      <style jsx global>{`
        @keyframes rgb-shift {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes rgb-shift-reverse {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(-360deg);
          }
        }

        @keyframes rgb-pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-rgb-shift {
          animation: rgb-shift 6s linear infinite;
        }

        .animate-rgb-shift-reverse {
          animation: rgb-shift-reverse 6s linear infinite;
        }

        .animate-rgb-pulse {
          animation: rgb-pulse 3s ease-in-out infinite;
        }

        /* Custom player styles */
        .volume-slider {
          -webkit-appearance: none;
          height: 6px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
        }

        .volume-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </ButtonLayout>
  );
};

export default WatchPage;
