"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { List, Clock, Play } from "lucide-react";
import { useRouter } from "next/navigation";

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

// Fungsi untuk mendapatkan sumber gambar dengan fallback
const getImageSrc = (thumbnail?: string) => {
  return thumbnail && thumbnail.trim() !== ""
    ? thumbnail
    : "/placeholder-anime.jpg";
};

// Komponen Episodes
const Episodes = ({ episodes }: { episodes: Episode[] }) => {
  const router = useRouter();

  if (!episodes || episodes.length === 0) {
    return null;
  }

  const handleEpisodeClick = (slug: string) => {
    router.push(`/nonton?url=${slug}`);
  };

  return (
    <motion.div
      className="episodes mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
        <List size={24} className="text-purple-400" />
        <span>Daftar Episode</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {episodes.map((episode, index) => (
          <motion.div
            key={episode.id}
            className="episode-card bg-gray-800/60 backdrop-blur-sm border border-purple-500/20 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-600/20 hover:border-purple-500/60 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.1 * (index % 5), duration: 0.3 },
            }}
            whileHover={{ scale: 1.03 }}
            onClick={() => handleEpisodeClick(episode.slug)}
          >
            <div className="relative">
              <Image
                src={getImageSrc(episode.image)}
                alt={`Poster Episode ${episode.episodeNumber}`}
                width={200}
                height={120}
                className="w-full h-[120px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>

              {/* Play button overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.div
                  className="bg-purple-600/80 p-2 rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play size={30} className="text-white" />
                </motion.div>
              </motion.div>

              <div className="absolute bottom-2 right-2 bg-purple-600 text-xs font-bold rounded-full px-2 py-1">
                Ep {episode.episodeNumber}
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-100 truncate">
                {episode.episodeTitle || `Episode ${episode.episodeNumber}`}
              </h3>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <Clock size={12} /> {episode.duration}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Episodes;
