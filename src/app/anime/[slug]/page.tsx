"use client";

import Image from "next/image";
import { ButtonLayout } from "@/components/Layout/Button";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Rekomendasi } from "@/components/api-anime/detail/rekomendasi";
import Episodes from "@/components/api-anime/detail/Episodes";
import Synopsis from "@/components/api-anime/detail/Synopsis";
import Genres from "@/components/api-anime/detail/Genres";
import { motion } from "framer-motion";

// Icons import
import {
  Calendar,
  Clock,
  Film,
  Star,
  Info,
  Tag,
  PlayCircle,
  List,
  Building2,
} from "lucide-react";

// Definisi tipe data
type Genre = {
  name: string;
  slug: string;
};

type Studio = {
  name: string;
  slug: string;
};

type Recommendation = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  image?: string;
  rating: string;
  type: string;
};

type Episode = {
  id: string;
  title: string;
  slug: string;
  animeSlug: string;
  animeTitle: string;
  episodeTitle: string;
  episodeNumber: string;
  image: string;
  type: string;
  views: number;
  duration: string;
  postedAt: string;
};

type ApiResponse = {
  success: boolean;
  data: {
    title: string;
    alternativeTitles: string[];
    synopsis: string;
    thumbnail: string;
    genres: Genre[];
    status: string;
    studios: Studio[];
    aired: string;
    seasons: { name: string; slug: string }[];
    type: string;
    duration: string;
    episodeCount: string;
    rating: number | string;
    trailerUrl?: string;
    recommendations: Recommendation[];
    episodes: Episode[];
  };
};

// Fungsi untuk mendapatkan sumber gambar dengan fallback
const getImageSrc = (thumbnail?: string) => {
  return thumbnail && thumbnail.trim() !== ""
    ? thumbnail
    : "/placeholder-anime.jpg";
};

// Animasi variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

export default function AnimeDetailsPage() {
  const params = useParams();
  const [animeData, setAnimeData] = useState<ApiResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnimeDetails() {
      try {
        if (!params.slug) return;

        setIsLoading(true);
        const response = await fetch(
          `/api/anime/${encodeURIComponent(params.slug as string)}`,
          {
            cache: "no-store",
          }
        );

        const result = (await response.json()) as ApiResponse;

        if (!response.ok || !result.success) {
          throw new Error(
            (!result.success && "Data tidak tersedia") ||
              "Gagal mengambil detail anime"
          );
        }

        // Set data anime dari result.data
        setAnimeData(result.data);
        setError(null);
      } catch (error) {
        console.error("Kesalahan Pengambilan Detail Anime:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan yang tidak diketahui"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnimeDetails();
  }, [params.slug]);

  // Fungsi untuk memformat rating dengan penanganan aman
  const formatRating = (rating: number | string | undefined) => {
    if (rating === undefined || rating === null) return "Tidak tersedia";

    const numRating = typeof rating === "string" ? parseFloat(rating) : rating;

    return isNaN(numRating) ? "Tidak tersedia" : `${numRating.toFixed(2)} / 10`;
  };

  return (
    <ButtonLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38] text-gray-100">
        <div className="min-h-screen bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38] text-gray-100 relative">
          {/* Background glow effects */}
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-800/10 blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-800/10 blur-[120px]"></div>
          </div>

          <div className="relative z-10 container mx-auto px-4 py-8">
            {/* Konten yang ada tetap di sini */}
            {isLoading && !animeData ? (
              <LoadingSkeleton />
            ) : error ? (
              <ErrorDisplay error={error} />
            ) : !animeData ? (
              <NotFoundDisplay />
            ) : (
              <AnimeContent animeData={animeData} formatRating={formatRating} />
            )}
          </div>
        </div>
      </div>
    </ButtonLayout>
  );
}

// Komponen Loading Skeleton
const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div className="bg-gray-700 rounded-lg h-[450px]"></div>
        <div>
          <div className="h-10 bg-gray-700 rounded-lg w-3/4 mb-6"></div>
          <div className="h-6 bg-gray-700 rounded-lg w-full mb-4"></div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="h-6 bg-gray-700 rounded-lg w-1/2 mb-4"></div>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-5 bg-gray-700 rounded-lg w-full mt-2"
                ></div>
              ))}
            </div>
            <div>
              <div className="h-6 bg-gray-700 rounded-lg w-1/2 mb-4"></div>
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-5 bg-gray-700 rounded-lg w-3/4 mt-2"
                ></div>
              ))}
              <div className="h-6 bg-gray-700 rounded-lg w-1/2 mt-6 mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-700 rounded-md w-16"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="h-7 bg-gray-700 rounded-lg w-1/4 mb-4"></div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-700 rounded-lg w-full mt-2"
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="h-8 bg-gray-700 rounded-lg w-1/4 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-gray-700 rounded-lg aspect-video"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Komponen Error
const ErrorDisplay = ({ error }: { error: string }) => {
  return (
    <motion.div
      className="text-center py-16 px-4 border border-red-500 bg-red-900/20 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Kesalahan Memuat Detail Anime</h1>
      <p className="text-red-300 mb-6">{error}</p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        onClick={() => window.location.reload()}
      >
        Coba Lagi
      </button>
    </motion.div>
  );
};

// Komponen Not Found
const NotFoundDisplay = () => {
  return (
    <motion.div
      className="text-center py-16 px-4 border border-blue-500 bg-blue-900/20 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold mb-4">Anime Tidak Ditemukan</h1>
      <p className="text-gray-300 mb-6">
        Anime yang diminta tidak dapat ditemukan.
      </p>
    </motion.div>
  );
};

// Komponen Konten Anime
const AnimeContent = ({
  animeData,
  formatRating,
}: {
  animeData: ApiResponse["data"];
  formatRating: (rating: number | string | undefined) => string;
}) => {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      {/* Hero Section dengan Backdrop */}
      <div className="relative mb-12 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage: `url(${getImageSrc(animeData.thumbnail)})`,
            filter: "blur(20px)",
          }}
        ></div>

        <div className="relative grid md:grid-cols-[300px_1fr] gap-8 p-6">
          {/* Poster Anime */}
          <motion.div className="anime-poster" variants={itemVariant}>
            <Image
              src={getImageSrc(animeData.thumbnail)}
              alt={`Poster anime ${animeData.title}`}
              width={300}
              height={450}
              className="rounded-lg shadow-lg object-cover w-full h-[450px] ring-2 ring-purple-500/50"
              priority
            />
          </motion.div>

          {/* Informasi Anime */}
          <motion.div className="anime-info z-10" variants={staggerChildren}>
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-4 text-white"
              variants={itemVariant}
            >
              {animeData.title}
            </motion.h1>

            {animeData.alternativeTitles &&
              animeData.alternativeTitles.length > 0 && (
                <motion.p className="text-gray-300 mb-4" variants={itemVariant}>
                  Judul Alternatif: {animeData.alternativeTitles.join(", ")}
                </motion.p>
              )}

            <motion.div
              className="grid md:grid-cols-2 gap-6 mb-6"
              variants={staggerChildren}
            >
              <motion.div variants={itemVariant}>
                <h2 className="font-semibold flex items-center gap-2 text-lg text-purple-300 mb-3">
                  <Info size={18} />
                  <span>Detail</span>
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <Film size={16} className="text-blue-300" />
                    <span>Tipe: {animeData.type}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Info size={16} className="text-blue-300" />
                    <span>Status: {animeData.status}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar size={16} className="text-blue-300" />
                    <span>Tayang: {animeData.aired}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock size={16} className="text-blue-300" />
                    <span>Durasi: {animeData.duration}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <List size={16} className="text-blue-300" />
                    <span>
                      Episode: {animeData.episodeCount || "Tidak diketahui"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-400" />
                    <span>Rating: {formatRating(animeData.rating)}</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={itemVariant}>
                <h2 className="font-semibold flex items-center gap-2 text-lg text-purple-300 mb-3">
                  <Building2 size={18} />
                  <span>Studio</span>
                </h2>
                <ul className="space-y-2">
                  {animeData.studios && animeData.studios.length > 0 ? (
                    animeData.studios.map((studio) => (
                      <li key={studio.slug} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                        {studio.name}
                      </li>
                    ))
                  ) : (
                    <li>Tidak ada informasi studio</li>
                  )}
                </ul>

                <h2 className="font-semibold flex items-center gap-2 text-lg text-purple-300 mt-6 mb-3">
                  <Tag size={18} />
                  <span>Genre</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Genres genres={animeData.genres} itemVariant={itemVariant} />
                </div>
              </motion.div>
            </motion.div>

            <Synopsis synopsis={animeData.synopsis} itemVariant={itemVariant} />

            {animeData.trailerUrl && (
              <motion.div className="trailer mb-6" variants={itemVariant}>
                <h2 className="font-semibold text-xl flex items-center gap-2 text-purple-300 mb-3">
                  <PlayCircle size={20} />
                  <span>Trailer</span>
                </h2>
                <div className="rounded-lg overflow-hidden border border-purple-500/30">
                  <iframe
                    src={animeData.trailerUrl}
                    title="Trailer Anime"
                    className="w-full aspect-video"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Daftar Episode */}
      {animeData.episodes && animeData.episodes.length > 0 && (
        <Episodes episodes={animeData.episodes} />
      )}
      {/* Rekomendasi */}
      {animeData.recommendations && animeData.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Rekomendasi recommendations={animeData.recommendations} />
        </motion.div>
      )}
    </motion.div>
  );
};
