"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { AnimeItem } from "./types";

interface FeaturedSliderProps {
  sliderData: AnimeItem[];
}

const FeaturedSlider: React.FC<FeaturedSliderProps> = ({ sliderData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Auto slide for the featured section
  useEffect(() => {
    if (!sliderData.length || isHovering) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [sliderData.length, isHovering]);

  // Handle swipe for mobile
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let startX: number;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      // Check if sidebar is open by looking at body styles
      if (document.body.style.overflow === "hidden") {
        // If sidebar is open, don't capture touch events
        return;
      }

      startX = e.touches[0].clientX;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Check if sidebar is open
      if (document.body.style.overflow === "hidden") {
        return;
      }

      if (!isDragging || !sliderData.length) return;
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe left - next slide
          setCurrentSlide((prev) => (prev + 1) % sliderData.length);
        } else {
          // Swipe right - previous slide
          setCurrentSlide(
            (prev) => (prev - 1 + sliderData.length) % sliderData.length
          );
        }
        isDragging = false;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    slider.addEventListener("touchstart", handleTouchStart);
    slider.addEventListener("touchmove", handleTouchMove);
    slider.addEventListener("touchend", handleTouchEnd);

    return () => {
      slider.removeEventListener("touchstart", handleTouchStart);
      slider.removeEventListener("touchmove", handleTouchMove);
      slider.removeEventListener("touchend", handleTouchEnd);
    };
  }, [sliderData.length]);

  // Function to format URL for nonton (watch) link
  const formatWatchUrl = (id: string) => {
    return `/nonton?url=${id}`;
  };

  // Function to format URL for info link by removing "nonton-" prefix and "-episode-XX" suffix
  const formatInfoUrl = (id: string) => {
    // Remove "nonton-" prefix if it exists
    let formattedId = id.startsWith("nonton-") ? id.substring(7) : id;

    // Remove "-episode-X" or "-episode-XX" suffix if it exists
    const episodePattern = /-episode-\d+$/;
    if (episodePattern.test(formattedId)) {
      formattedId = formattedId.replace(episodePattern, "");
    }

    return `/anime/${formattedId}`;
  };

  if (sliderData.length === 0) return null;

  return (
    <section
      className="py-4 sm:py-6 px-3 sm:px-4 md:px-6 relative overflow-hidden rounded-xl"
      ref={sliderRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        background:
          "linear-gradient(135deg, #0c0a20 0%, #1a103a 50%, #0e1a38 100%)",
      }}
    >
      {/* Background glow effects - minimized */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-purple-800/15 blur-[80px] z-0 animate-pulse"></div>
        <div className="absolute bottom-5 left-10 w-56 h-56 rounded-full bg-blue-800/15 blur-[80px] z-0"></div>
      </div>

      {/* Section header with animated underline */}
      <div className="relative z-10 flex items-center justify-between mb-4 sm:mb-6">
        <div className="relative">
          <div className="h-0.5 w-2/3 mt-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full"></div>
        </div>
      </div>

      {/* Main carousel container */}
      <div className="relative overflow-hidden">
        {/* Perspective container */}
        <div className="flex items-stretch justify-center perspective-[1000px] min-h-[140px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px]">
          {/* Carousel slides */}
          <div className="relative w-[80%] sm:w-[75%] md:w-[65%] lg:w-[55%] mx-auto">
            {sliderData.map((item, index) => {
              const isActive = index === currentSlide;
              const isPrev =
                index === currentSlide - 1 ||
                (currentSlide === 0 && index === sliderData.length - 1);
              const isNext =
                index === currentSlide + 1 ||
                (currentSlide === sliderData.length - 1 && index === 0);

              let position = "hidden";
              let zIndex = 0;
              let scale = 1;
              let opacity = 1;
              let translateX = "0%";
              let rotateY = "0deg";

              if (isActive) {
                position = "relative";
                zIndex = 20;
                scale = 1;
                opacity = 1;
                translateX = "0%";
                rotateY = "0deg";
              } else if (isPrev) {
                position = "absolute";
                zIndex = 10;
                scale = 0.65;
                opacity = 0.35;
                translateX = "-45%";
                rotateY = "0deg";
              } else if (isNext) {
                position = "absolute";
                zIndex = 10;
                scale = 0.65;
                opacity = 0.35;
                translateX = "45%";
                rotateY = "0deg";
              }

              return (
                <div
                  key={item.id}
                  className={`${position} inset-0 transition-all duration-700 ease-out`}
                  style={{
                    zIndex: zIndex,
                    transform: `translateX(${translateX}) scale(${scale}) rotateY(${rotateY})`,
                    opacity: opacity,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="relative rounded-lg overflow-hidden shadow-md aspect-[16/9] bg-gray-900 group border border-indigo-500/10 h-full">
                    {/* Glow effect for active slide - enhanced */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>
                    )}

                    {/* Image - without resize parameter */}
                    <motion.img
                      src={item.image.replace(/[?&]resize=\d+,\d+/, "")}
                      alt={item.title}
                      className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      initial={{ scale: 1 }}
                      animate={{
                        scale: isActive ? 1.05 : 1,
                      }}
                      transition={{
                        duration: 10,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />

                    {/* Overlay gradient for text - enhanced */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-[1]"></div>

                    {/* Side gradients - enhanced */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent opacity-70 z-[1]"></div>
                    <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-transparent opacity-70 z-[1]"></div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-2 sm:p-2.5 md:p-3 z-10">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{
                          y: isActive ? 0 : 20,
                          opacity: isActive ? 1 : 0,
                        }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col"
                      >
                        <h4 className="text-white text-xs sm:text-xs md:text-sm lg:text-base font-bold line-clamp-1 sm:line-clamp-2 mb-0.5 sm:mb-1 drop-shadow-md">
                          {item.title}
                        </h4>

                        <div className="flex flex-wrap gap-0.5 mb-0.5 sm:mb-1">
                          {item.latestEpisode && (
                            <div className="inline-flex items-center rounded-md py-0.5 px-1 sm:py-0.5 sm:px-1.5 text-white bg-indigo-900/40 text-[10px] sm:text-xs backdrop-blur-sm border border-indigo-500/20">
                              <motion.svg
                                className="w-2.5 h-2.5 mr-1 sm:w-3 sm:h-3 sm:mr-1.5 text-indigo-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.5 }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 4v16M17 4v16M3 8h18M3 16h18"
                                />
                              </motion.svg>
                              Episode {item.latestEpisode}
                            </div>
                          )}

                          {item.type && (
                            <div className="inline-flex items-center rounded-md py-1 px-2 text-white bg-indigo-900/40 text-xs backdrop-blur-sm border border-indigo-500/20">
                              <motion.span
                                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                                  item.type === "SUB"
                                    ? "bg-indigo-400"
                                    : "bg-yellow-400"
                                } mr-1 sm:mr-1.5`}
                                animate={{
                                  scale: [1, 1.5, 1],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              ></motion.span>
                              {item.type}
                            </div>
                          )}

                          {item.score && (
                            <div className="inline-flex items-center rounded-md py-1 px-2 text-white bg-indigo-900/40 text-xs backdrop-blur-sm border border-indigo-500/20">
                              <motion.svg
                                className="w-2.5 h-2.5 mr-1 sm:w-3 sm:h-3 sm:mr-1.5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                animate={{
                                  rotate: [0, 10, -10, 0],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </motion.svg>
                              {item.score.toFixed(1)}
                            </div>
                          )}
                        </div>

                        <div className="flex mt-0.5 sm:mt-1 gap-1">
                          <Link
                            href={formatWatchUrl(item.id)}
                            className="group/btn bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 text-white font-medium text-[10px] sm:text-xs py-1 px-2 sm:py-1.5 sm:px-3 rounded-lg inline-flex items-center shadow-lg shadow-indigo-500/20 transition-all duration-300 relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity duration-300"></div>
                            <motion.svg
                              className="h-2.5 w-2.5 mr-1 sm:h-3 sm:w-3 sm:mr-1.5"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                              whileHover={{ scale: 1.2 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 10,
                              }}
                            >
                              <path d="M8 5.14v14l11-7-11-7z" />
                            </motion.svg>
                            Tonton
                          </Link>

                          <Link
                            href={formatInfoUrl(item.id)}
                            className="group/btn bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-indigo-500/20 hover:border-indigo-500/40 text-white font-medium text-[10px] sm:text-xs py-1 px-2 sm:py-1.5 sm:px-3 rounded-lg inline-flex items-center transition-all duration-300"
                          >
                            <motion.svg
                              className="h-2.5 w-2.5 mr-1 sm:h-3 sm:w-3 sm:mr-1.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              xmlns="http://www.w3.org/2000/svg"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </motion.svg>
                            Info
                          </Link>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation arrows - enhanced */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + sliderData.length) % sliderData.length
            )
          }
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 h-full px-2 sm:px-4 flex items-center justify-center"
          aria-label="Previous slide"
        >
          <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-900/40 backdrop-blur-md border border-indigo-500/30 text-white hover:bg-indigo-800/50 hover:border-indigo-500/50 transition-all duration-300 group">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ x: [0, -3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </motion.svg>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % sliderData.length)
          }
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 h-full px-2 sm:px-4 flex items-center justify-center"
          aria-label="Next slide"
        >
          <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-900/40 backdrop-blur-md border border-indigo-500/30 text-white hover:bg-indigo-800/50 hover:border-indigo-500/50 transition-all duration-300 group">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ x: [0, 3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </motion.svg>
          </div>
        </motion.button>
      </div>
    </section>
  );
};

export default FeaturedSlider;
