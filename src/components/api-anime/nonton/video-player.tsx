"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { ExternalLink, Info, Link as LinkIcon } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  title: string;
  isHLS: boolean;
  sources: {
    download?: {
      v720p?: Record<string, string | null>;
      v480p?: Record<string, string | null>;
    };
  };
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  isHLS,
  sources,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showAudioTip, setShowAudioTip] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const playerMode = isHLS ? "hls" : "iframe";
  const [directLinks, setDirectLinks] = useState<
    { name: string; url: string }[]
  >([]);
  const [showDirectLinks, setShowDirectLinks] = useState(false);

  // Mengatur direct links berdasarkan sumber
  useEffect(() => {
    if (!sources) return;

    const links: { name: string; url: string }[] = [];

    // Menambahkan link download sebagai opsi direct play
    // Biasanya link download bisa langsung dimainkan di browser
    if (sources.download) {
      if (sources.download.v720p) {
        Object.entries(sources.download.v720p).forEach(([host, url]) => {
          if (url) links.push({ name: `${host} (720p)`, url: url });
        });
      }

      if (sources.download.v480p) {
        Object.entries(sources.download.v480p).forEach(([host, url]) => {
          if (url) links.push({ name: `${host} (480p)`, url: url });
        });
      }
    }

    setDirectLinks(links);
  }, [sources]);

  // Menangani klik pada video container
  const handleContainerClick = () => {
    setShowControls(!showControls);

    // Coba unmute video jika ada
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 0.5;

      // Coba mainkan video jika sedang pause
      if (videoRef.current.paused) {
        videoRef.current.play().catch((err) => {
          console.log("Autoplay prevented:", err);
          setShowAudioTip(true);
        });
      }
    }
  };

  // Tampilkan/sembunyikan direct links
  const toggleDirectLinks = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDirectLinks(!showDirectLinks);
  };

  // Membuka link download langsung
  const openDirectLink = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, "_blank");
  };

  // Membuka video di tab baru
  const openInNewTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(src, "_blank");
  };

  // Efek untuk mendeteksi perangkat mobile
  useEffect(() => {
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    // Tampilkan tips khusus untuk perangkat mobile
    if (isMobileDevice) {
      setShowAudioTip(true);

      // Sembunyikan tip setelah 8 detik
      const timer = setTimeout(() => {
        setShowAudioTip(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Fungsi untuk mempersiapkan HLS player
  const setupHLSPlayer = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    // Set volume tinggi untuk memaksimalkan peluang audio terdengar
    video.volume = 1.0;
    video.muted = false;

    // Coba mainkan dengan muted terlebih dahulu (lebih besar kemungkinan berhasil)
    video.muted = true;
    video
      .play()
      .then(() => {
        // Berhasil play, coba unmute setelah beberapa saat
        setTimeout(() => {
          video.muted = false;
          video.volume = 0.8; // Sedikit lebih rendah dari max untuk menghindari distorsi
        }, 1000);
      })
      .catch((err) => {
        console.log("Autoplay prevented, user interaction needed:", err);
        setShowAudioTip(true);
      });
  };

  // Efek untuk menangani HLS player
  useEffect(() => {
    if (playerMode === "hls" && videoRef.current) {
      // Fungsi untuk inisialisasi HLS.js
      const initializeHLS = () => {
        if (!window.Hls) {
          setTimeout(initializeHLS, 500);
          return;
        }

        if (window.Hls.isSupported()) {
          const hls = new window.Hls();
          hls.loadSource(src);
          hls.attachMedia(videoRef.current!);

          hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
            setupHLSPlayer();
          });

          return () => {
            hls.destroy();
          };
        } else if (
          videoRef.current!.canPlayType("application/vnd.apple.mpegurl")
        ) {
          // Untuk Safari yang mendukung HLS secara native
          videoRef.current!.src = src;
          setupHLSPlayer();
        }
      };

      // Mulai inisialisasi HLS
      if (window.Hls) {
        initializeHLS();
      }
    }
  }, [playerMode, src]);

  // Render video player berdasarkan mode
  return (
    <div className="relative w-full h-full overflow-hidden bg-black rounded-xl">
      {/* Control Options - Dipindahkan ke atas */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {/* Direct Links Button */}
        <div className="relative">
          <button
            onClick={toggleDirectLinks}
            className="bg-purple-700/80 hover:bg-purple-600/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors shadow-lg"
          >
            <LinkIcon size={14} />
            <span>Download</span>
          </button>

          {/* Direct Links Dropdown */}
          {showDirectLinks && directLinks.length > 0 && (
            <div className="absolute top-full left-0 mt-2 bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700/50 p-1 min-w-[180px] z-30">
              <div className="text-xs text-gray-300 mb-1 px-2 pt-1">
                Sumber Video Langsung:
              </div>
              {directLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={(e) => openDirectLink(e, link.url)}
                  className="block w-full text-left text-xs text-white py-1.5 px-2 rounded hover:bg-gray-800/70 truncate whitespace-nowrap"
                >
                  {link.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Open in New Tab */}
        <button
          onClick={openInNewTab}
          className="bg-gray-900/80 hover:bg-gray-800 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors shadow-lg"
        >
          <ExternalLink size={14} />
          <span>Tab Baru</span>
        </button>
      </div>

      {/* Player Container */}
      <div className="w-full h-full relative" onClick={handleContainerClick}>
        {/* HLS Player */}
        {playerMode === "hls" && (
          <>
            <Script
              src="https://cdn.jsdelivr.net/npm/hls.js@latest"
              strategy="lazyOnload"
            />
            <video
              ref={videoRef}
              className="w-full h-full"
              playsInline
              controls
              poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            />
          </>
        )}

        {/* Iframe Player */}
        {playerMode === "iframe" && (
          <iframe
            ref={iframeRef}
            src={`${src}${src.includes("?") ? "&" : "?"}volume=100`}
            title={title}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}

        {/* Audio Tips - Digeser ke tengah */}
        {showAudioTip && (
          <div className="absolute top-16 left-0 right-0 flex justify-center pointer-events-none">
            <div className="bg-black/80 text-white text-xs rounded-md px-3 py-2 animate-pulse max-w-xs text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <Info size={12} className="text-yellow-400" />
                <span className="font-semibold">Masalah Audio?</span>
              </div>
              <p>
                Untuk perangkat mobile, gunakan opsi &quot;Download
                Langsung&quot; dan putar di aplikasi video
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add Hls type declaration
declare global {
  interface Window {
    Hls: {
      isSupported: () => boolean;
      Events: {
        MANIFEST_PARSED: string;
      };
      new (): {
        loadSource: (src: string) => void;
        attachMedia: (media: HTMLVideoElement) => void;
        on: (event: string, callback: () => void) => void;
        destroy: () => void;
      };
    };
  }
}
