"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ButtonLayout } from "@/components/Layout/Button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Globe,
  Star,
  CheckCircle2,
  HandHeart,
  Smile,
  Award,
  Sparkles,
  Share2,
  Coins,
  PartyPopper,
} from "lucide-react";

type LanguageKey = "indonesia" | "english" | "japan";

const DonationQRPage = () => {
  const [language, setLanguage] = useState<LanguageKey>("indonesia");
  const [animationState, setAnimationState] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const gratitudeMessages: Record<LanguageKey, string[]> = {
    indonesia: [
      "Terima kasih banyak atas donasi Anda!",
      "Setiap kontribusi Anda membuat perbedaan nyata.",
      "Kami sangat menghargai kebaikan hati Anda.",
      "Dukungan Anda memberi harapan dan kekuatan.",
    ],
    english: [
      "Thank you so much for your donation!",
      "Every contribution you make creates real impact.",
      "We deeply appreciate your generosity.",
      "Your support brings hope and strength.",
    ],
    japan: [
      "ご寄付いただき、誠にありがとうございます！",
      "あなたの貢献は大きな違いを生み出します。",
      "心から感謝の意を表します。",
      "あなたの支援は希望と力をもたらします。",
    ],
  };

  const languages: Array<{ code: LanguageKey; icon: string; name: string }> = [
    { code: "indonesia", icon: "🇮🇩", name: "Indonesia" },
    { code: "english", icon: "🇬🇧", name: "English" },
    { code: "japan", icon: "🇯🇵", name: "日本語" },
  ];

  // Set mounted state to true after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animasi berputar untuk ikon
  useEffect(() => {
    const animationTimer = setInterval(() => {
      setAnimationState((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(animationTimer);
  }, []);

  // Simulasi efek "terima kasih" setelah scan
  const simulateDonation = () => {
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
  };

  // Variasi animasi berdasarkan state
  const getIconAnimation = (iconIndex: number): string => {
    const animations = [
      "animate-bounce",
      "animate-pulse",
      "animate-spin-slow",
      "animate-float",
    ];
    return animations[(iconIndex + animationState) % 4];
  };

  // SSR-safe random number generator
  const getRandomPosition = (min: number, max: number): number => {
    return min + Math.random() * (max - min);
  };

  return (
    <ButtonLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-900 text-white flex items-center justify-center p-4 overflow-hidden relative">
        {/* Particle effects background - SSR safe */}
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => {
              // Pre-calculate random values for SSR
              const randomX = getRandomPosition(0, 100);
              const randomY = getRandomPosition(0, 100);
              const randomOpacity = getRandomPosition(0.2, 0.5);
              const randomSize = getRandomPosition(2, 8);
              const randomDuration = getRandomPosition(5, 20);

              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-white/20"
                  initial={{
                    x: `${randomX}vw`,
                    y: `${randomY}vh`,
                    opacity: randomOpacity,
                  }}
                  animate={{
                    y: [null, `${randomY - 50}vh`],
                    opacity: [null, 0],
                  }}
                  transition={{
                    duration: randomDuration,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    width: `${randomSize}px`,
                    height: `${randomSize}px`,
                  }}
                />
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-gray-800/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 relative z-10"
        >
          {/* Shimmer effect on border */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute -inset-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent animate-shimmer"></div>
          </div>

          {/* Language Selector */}
          <motion.div
            className="flex justify-center space-x-4 p-4 bg-gray-700/30 backdrop-blur-lg border-b border-white/5"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center transition-all duration-300 px-3 py-2 rounded-xl ${
                  language === lang.code
                    ? "bg-indigo-600/50 ring-2 ring-indigo-400 shadow-lg shadow-indigo-700/20"
                    : "opacity-70 hover:opacity-100 hover:bg-gray-700/40"
                }`}
              >
                <span className="text-2xl mb-1">{lang.icon}</span>
                <span className="text-xs font-medium">{lang.name}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* QR Code Section */}
          <motion.div
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-800/20 to-gray-900/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.02 }}
              onClick={simulateDonation}
            >
              <AnimatePresence>
                {showThankYou && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-20 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-2xl flex items-center justify-center"
                  >
                    <div className="text-center">
                      <PartyPopper className="w-16 h-16 text-yellow-300 mx-auto mb-4 animate-bounce" />
                      <motion.h2
                        className="text-2xl font-bold"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        Terima Kasih!
                      </motion.h2>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="rounded-2xl p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-xl">
                <div className="relative rounded-xl overflow-hidden bg-white p-4">
                  <Image
                    src="/images/donasi/qris.jpeg"
                    alt="Donation QR Code"
                    width={350}
                    height={350}
                    className="rounded-lg"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-fuchsia-600/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ opacity: 0.8 }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <HandHeart className="w-20 h-20 text-white drop-shadow-glow" />
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              {/* Scan indicators */}
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white/80 text-indigo-950 px-4 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                </span>
                Tap to scan
              </motion.div>
            </motion.div>

            {/* Gratitude Messages with staggered animation */}
            <motion.div
              className="mt-8 text-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex justify-center space-x-4 mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Globe className="w-6 h-6 text-blue-400" />
                </motion.div>
                <motion.div className={getIconAnimation(0)}>
                  <Award className="w-6 h-6 text-yellow-400" />
                </motion.div>
                <motion.div className={getIconAnimation(1)}>
                  <Star className="w-6 h-6 text-purple-400" />
                </motion.div>
                <motion.div className={getIconAnimation(2)}>
                  <Sparkles className="w-6 h-6 text-pink-400" />
                </motion.div>
              </div>

              <div>
                {gratitudeMessages[language].map((message, msgIndex) => (
                  <motion.p
                    key={msgIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * msgIndex + 0.7 }}
                    className="text-lg font-medium text-gray-200 mb-3 flex items-center"
                  >
                    <CheckCircle2 className="mr-3 w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {message}
                    </span>
                  </motion.p>
                ))}
              </div>
            </motion.div>

            {/* Interactive Elements */}
            <motion.div
              className="mt-8 flex justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600/70 hover:bg-indigo-500 rounded-xl text-sm font-medium backdrop-blur-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-4 h-4" />
                Bagikan
              </motion.button>
              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/70 hover:bg-purple-500 rounded-xl text-sm font-medium backdrop-blur-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Coins className="w-4 h-4" />
                Donasi Lain
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="bg-black/30 backdrop-blur-md p-4 text-center border-t border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="flex justify-center items-center space-x-3">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <Heart className="w-5 h-5 text-red-500" />
              </motion.div>
              <div className="text-sm font-medium bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                Coderama
              </div>
              <Smile className="w-5 h-5 text-yellow-500" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }

        .drop-shadow-glow {
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </ButtonLayout>
  );
};

export default DonationQRPage;
