"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { List, Clock, Play, Calendar, Eye } from "lucide-react";
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

const getImageSrc = (url: string) => {
  if (!url) return "/placeholder-anime.jpg";

  // Jika URL sudah memiliki parameter
  if (url.includes("?")) {
    return url + "&resize=80,120";
  }

  // Jika URL belum memiliki parameter
  return url + "?resize=80,120";
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

      <div className="space-y-3">
        {episodes.map((episode, index) => (
          <motion.div
            key={episode.id}
            className="episode-card bg-gray-800/60 backdrop-blur-sm border border-purple-500/20 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-600/20 hover:border-purple-500/60 transition-all duration-300 flex cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.05 * index, duration: 0.3 },
            }}
            whileHover={{ scale: 1.01 }}
            onClick={() => handleEpisodeClick(episode.slug)}
          >
            {/* Left side - Image (smaller and vertically centered) */}
            <div className="relative w-[80px] h-auto flex-shrink-0 flex items-center self-stretch">
              <div className="relative w-full aspect-[2/3] overflow-hidden">
                <Image
                  src={getImageSrc(episode.image)}
                  alt={`Poster Episode ${episode.episodeNumber}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />

                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-purple-600/80 p-1 rounded-full">
                    <Play size={18} className="text-white" />
                  </div>
                </div>

                {/* Episode badge - smaller and repositioned */}
                <div className="absolute top-1 left-1 bg-purple-600 text-[10px] font-bold rounded-full px-1.5 py-0.5 shadow-md">
                  {episode.episodeNumber}
                </div>
              </div>
            </div>

            {/* Right side - Details - adjusted spacing for smaller image */}
            <div className="flex-1 p-2 sm:p-3 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5 line-clamp-5">
                  {episode.animeTitle}{" "}
                  <span className="text-purple-300">
                    {episode.episodeTitle || `Episode ${episode.episodeNumber}`}
                  </span>
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-gray-300">
                <div className="flex items-center gap-1">
                  <Clock size={10} className="text-purple-400" />
                  <span>{episode.duration}</span>
                </div>

                <div className="flex items-center gap-1 col-span-2">
                  <Eye size={10} className="text-purple-400" />
                  <span>{episode.views.toLocaleString()} views</span>
                </div>

                <div className="flex items-center gap-1 col-span-2">
                  <Calendar size={10} className="text-purple-400" />
                  <span>Uploaded {episode.postedAt}</span>
                </div>
              </div>

              {/* Type badge - moved to right side */}
              <div className="self-end mt-1">
                <span className="bg-gray-900/80 text-white text-[10px] py-0.5 px-1.5 rounded-md backdrop-blur-sm">
                  {episode.type}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Episodes;
