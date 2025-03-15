"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { RecentlyAdded as RecentlyAddedType } from "./types";

interface RecentlyAddedProps {
  animeList: RecentlyAddedType[];
}

const RecentlyAdded: React.FC<RecentlyAddedProps> = ({ animeList }) => {
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
              Recently Added
            </h3>
            <div className="h-0.5 w-1/2 mt-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Grid layout - 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {animeList.map((anime, index) => (
            <motion.div
              key={anime.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-[#141332]/60 backdrop-blur-sm rounded-lg overflow-hidden border border-indigo-500/10 shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <a
                  href={`/${anime.id.replace(/^\//, "")}`}
                  className="block w-full h-full"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={anime.image}
                      alt={anime.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      className="object-cover object-center transform hover:scale-110 transition-transform duration-700"
                      priority={index < 4}
                    />
                  </div>
                </a>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>

                <div className="absolute top-2 right-2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md font-medium shadow-md inline-flex items-center gap-1">
                    <svg
                      className="h-2.5 w-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="ml-0.5">New</span>
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <a
                    href={`/${anime.id.replace(/^\//, "")}`}
                    className="w-full py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md text-[10px] sm:text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                  >
                    <svg
                      className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Details
                  </a>
                </div>
              </div>

              <div className="p-2.5 sm:p-3">
                <a href={`/${anime.id.replace(/^\//, "")}`} className="block">
                  <h4 className="font-medium text-xs sm:text-sm line-clamp-2 h-8 text-white/90 hover:text-indigo-400 transition-colors">
                    {anime.title}
                  </h4>
                </a>

                <div className="flex justify-between items-center mt-1.5">
                  <div className="flex items-center">
                    <svg
                      className="h-3 w-3 text-yellow-400 mr-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-[10px] sm:text-xs font-medium text-white/80">
                      {anime.score.toFixed(1)}
                    </span>
                  </div>

                  <span className="text-[10px] sm:text-xs text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                    {anime.type}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyAdded;
