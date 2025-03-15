import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Film } from "lucide-react";

type Recommendation = {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  image?: string;
  rating: string | number;
  type: string;
};

type RekomendasiProps = {
  recommendations: Recommendation[];
};

// Fungsi untuk mendapatkan sumber gambar dengan fallback dan menghapus parameter resize
const getImageSrc = (thumbnail?: string | null, image?: string) => {
  // Cek jika thumbnail tersedia
  if (thumbnail && thumbnail.trim() !== "") {
    // Hapus parameter resize dari URL
    return thumbnail.replace(/\?resize=\d+,\d+/, "");
  }

  // Cek jika image tersedia
  if (image && image.trim() !== "") {
    // Hapus parameter resize dari URL
    return image.replace(/\?resize=\d+,\d+/, "");
  }

  return "/placeholder-anime.jpg";
};

// Fungsi untuk memformat rating
const formatRating = (rating: string | number) => {
  if (rating === undefined || rating === null) return "N/A";

  const numRating = typeof rating === "string" ? parseFloat(rating) : rating;
  return !isNaN(numRating) ? numRating.toFixed(2) : "N/A";
};

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export function Rekomendasi({ recommendations }: RekomendasiProps) {
  // Debug - hapus di production
  console.log("Recommendations in component:", recommendations);

  // Jika tidak ada rekomendasi, jangan render apa-apa
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommendations mt-12 mb-12">
      <motion.h2
        className="text-2xl font-bold mb-6 flex items-center gap-2 text-white"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Star size={24} className="text-yellow-400" />
        <span>Anime Rekomendasi</span>
      </motion.h2>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {recommendations.map((rec) => (
          <motion.div
            key={rec.id}
            variants={item}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
          >
            <Link href={`/anime/${rec.slug}`} className="block h-full">
              <div className="anime-card bg-gray-900/80 backdrop-blur-sm border border-blue-800/30 rounded-lg overflow-hidden shadow-lg hover:shadow-blue-600/20 hover:border-blue-600/60 transition-all duration-300 h-full flex flex-col">
                <div className="relative">
                  <Image
                    src={getImageSrc(rec.thumbnail, rec.image)}
                    alt={`Poster anime ${rec.title}`}
                    width={145}
                    height={207}
                    className="w-full h-[180px] object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent opacity-60"></div>

                  {/* Badge untuk rating */}
                  <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-1">
                    <Star size={12} />
                    {formatRating(rec.rating)}
                  </div>

                  {/* Badge untuk type */}
                  <div className="absolute bottom-2 left-2 bg-blue-700 text-white rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-1">
                    <Film size={12} />
                    {rec.type}
                  </div>
                </div>

                <div className="p-3 flex-grow">
                  <h3 className="text-sm font-medium text-gray-100 leading-tight">
                    {rec.title}
                  </h3>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
