"use client";

import { useRouter } from "next/navigation";
import { Tag } from "lucide-react";
import { motion } from "framer-motion";

interface Genre {
  name: string;
  slug: string;
}

interface GenresProps {
  genres: Genre[];
  itemVariant: {
    hidden: {
      y: number;
      opacity: number;
    };
    visible: {
      y: number;
      opacity: number;
      transition: {
        type: string;
        stiffness: number;
      };
    };
  };
}

const Genres = ({ genres, itemVariant }: GenresProps) => {
  const router = useRouter();

  const handleGenreClick = (slug: string) => {
    router.push(`/genres/${slug}`);
  };

  return (
    <motion.div variants={itemVariant}>
      <h2 className="font-semibold flex items-center gap-2 text-lg text-purple-300 mt-6 mb-3">
        <Tag size={18} />
        <span>Genre</span>
      </h2>
      <div className="flex flex-wrap gap-2">
        {genres && genres.length > 0 ? (
          genres.map((genre) => (
            <button
              key={genre.slug}
              onClick={() => handleGenreClick(genre.slug)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 rounded-full text-sm hover:shadow-lg hover:shadow-purple-600/30 hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              {genre.name}
            </button>
          ))
        ) : (
          <span className="text-gray-400">Tidak ada genre</span>
        )}
      </div>
    </motion.div>
  );
};

export default Genres;
