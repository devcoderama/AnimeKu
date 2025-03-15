"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { AnimeItem } from "./types";

interface PopularAnimeProps {
  animeList: AnimeItem[];
}

const PopularAnime: React.FC<PopularAnimeProps> = ({ animeList }) => {
  if (animeList.length === 0) return null;

  return (
    <section className="py-8 px-4 sm:px-6 bg-gradient-to-br from-[#0c0a20] via-[#1a103a] to-[#0e1a38] rounded-xl relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-purple-800/10 blur-[100px] z-0 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-blue-800/10 blur-[100px] z-0"></div>
      </div>

      <div className="relative z-10">
        {/* Section header with animated underline */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative">
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Popular Anime
            </h3>
            <div className="h-0.5 w-1/2 mt-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Mobile view (2 columns grid) - visible only on small screens */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {animeList.map((anime, index) => (
            <motion.div
              key={`mobile-${anime.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-[#141332]/60 backdrop-blur-sm rounded-lg overflow-hidden border border-indigo-500/10 shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <a
                  href={`/nonton?url=${anime.id.replace(/^\//, "")}`}
                  className="block w-full h-full"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={anime.image}
                      alt={anime.title}
                      fill
                      sizes="(max-width: 767px) 50vw, 33vw"
                      className="object-cover object-center transform hover:scale-110 transition-transform duration-700"
                      priority={index < 2}
                    />
                  </div>
                </a>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>

                <div className="absolute top-2 left-2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[8px] px-1.5 py-0.5 rounded-md font-medium shadow-md">
                    {anime.type}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 flex items-center space-x-1.5">
                  <span className="bg-black/50 text-white text-[8px] px-1.5 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
                    <svg
                      className="h-2 w-2 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    {anime.score.toFixed(1)}
                  </span>

                  <span className="bg-black/50 text-white text-[8px] px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                    Ep {anime.latestEpisode}
                  </span>
                </div>
              </div>
              <div className="p-2">
                <a
                  href={`/nonton?url=${anime.id.replace(/^\//, "")}`}
                  className="block"
                >
                  <h4 className="text-xs font-medium line-clamp-2 h-8 text-white/90 hover:text-indigo-400 transition-colors">
                    {anime.title}
                  </h4>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop view (horizontal cards) - visible only on medium screens and up */}
        <div className="hidden md:flex md:flex-col md:space-y-3">
          {animeList.map((anime, index) => (
            <motion.div
              key={`desktop-${anime.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-[#141332]/60 backdrop-blur-sm rounded-lg overflow-hidden border border-indigo-500/10 shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 hover:border-indigo-500/30 flex h-[75px]"
            >
              {/* Left side - image */}
              <div className="relative w-14 shrink-0">
                <a
                  href={`/nonton?url=${anime.id.replace(/^\//, "")}`}
                  className="block w-full h-full"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={anime.image.replace(/[?&]resize=\d+,\d+/, "")}
                      alt={anime.title}
                      fill
                      sizes="56px"
                      className="object-cover object-center"
                    />
                  </div>
                </a>
              </div>

              {/* Right side - info */}
              <div className="flex-1 p-3 flex flex-col justify-center">
                <div>
                  <a
                    href={`/nonton?url=${anime.id.replace(/^\//, "")}`}
                    className="block"
                  >
                    <h4 className="text-sm font-semibold line-clamp-1 text-white/90 hover:text-indigo-400 transition-colors">
                      {anime.title}
                    </h4>
                  </a>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/60 flex items-center">
                        Episode{" "}
                        <span className="text-indigo-400 ml-1">
                          {anime.latestEpisode}
                        </span>
                      </span>

                      <div className="flex items-center">
                        <svg
                          className="h-3 w-3 text-yellow-400 mr-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <span className="text-xs font-medium text-white/80">
                          {anime.score.toFixed(1)}
                        </span>
                      </div>

                      <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                        {anime.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularAnime;
