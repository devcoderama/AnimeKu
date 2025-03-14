"use client";

import React from "react";
import { motion } from "framer-motion";
import { LatestEpisode } from "./types";

interface LatestEpisodesProps {
  episodes: LatestEpisode[];
}

const LatestEpisodes: React.FC<LatestEpisodesProps> = ({ episodes }) => {
  if (episodes.length === 0) return null;

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
              Latest Episodes
            </h3>
            <div className="h-0.5 w-1/2 mt-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full"></div>
          </div>
        </div>

        {/* Grid layout - 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {episodes.map((episode, index) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-[#141332]/60 backdrop-blur-sm rounded-lg overflow-hidden border border-indigo-500/10 shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]"
            >
              <div className="relative h-36 sm:h-40 md:h-44 overflow-hidden">
                <a
                  href={`/nonton?url=${episode.id.replace(/^\//, "")}`}
                  className="block w-full h-full"
                >
                  <img
                    src={episode.image.replace(/[?&]resize=\d+,\d+/, "")}
                    alt={episode.animeTitle}
                    className="w-full h-full object-cover object-center transform hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                </a>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>

                <a
                  href={`/nonton?url=${episode.id.replace(/^\//, "")}`}
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white transform scale-90 hover:scale-100 transition-all duration-300 shadow-xl group">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-white transition-transform duration-300 group-hover:scale-110"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 5.14v14l11-7-11-7z" />
                    </svg>
                  </div>
                </a>

                <div className="absolute top-2 left-2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-md font-medium shadow-md">
                    {episode.type}
                  </span>
                </div>

                <div className="absolute bottom-2 right-2 flex items-center space-x-1.5">
                  <span className="bg-black/50 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
                    <svg
                      className="h-2.5 w-2.5 text-indigo-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
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
                    {episode.views.toLocaleString()}
                  </span>

                  <span className="bg-black/50 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md backdrop-blur-sm flex items-center gap-1">
                    <svg
                      className="h-2.5 w-2.5 text-indigo-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {episode.duration}
                  </span>
                </div>
              </div>

              <div className="p-2.5 sm:p-3">
                <a
                  href={`/nonton?url=${episode.id.replace(/^\//, "")}`}
                  className="block"
                >
                  <h4 className="font-semibold text-xs sm:text-sm md:text-base line-clamp-1 mb-1 text-white/90 hover:text-indigo-400 transition-colors">
                    {episode.animeTitle}
                  </h4>
                </a>

                <div className="flex items-center justify-between">
                  <p className="text-[10px] sm:text-xs text-indigo-400 font-medium">
                    Ep {episode.episodeNumber}
                  </p>

                  <span className="text-[10px] sm:text-xs text-white/50 flex items-center gap-0.5">
                    <svg
                      className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-indigo-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {episode.postedAt} ago
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="/episode"
            className="inline-flex px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 items-center gap-2 mx-auto group"
          >
            <span className="text-xs sm:text-sm">View More Episodes</span>
            <svg
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default LatestEpisodes;
