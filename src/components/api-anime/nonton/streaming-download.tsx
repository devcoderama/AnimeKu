"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Settings,
  Download,
  ChevronDown,
  Check,
  ExternalLink,
} from "lucide-react";

// Types
import { MirrorEmbed, Sources } from "@/types/anime";

interface QualityOption {
  value: string;
  label: string;
}

interface ServerOption {
  value: string;
  label: string;
  type: string;
}

interface StreamingDownloadPanelProps {
  sources: Sources;
  videoTitle: string;
  onVideoSourceChange: (url: string, isHLS?: boolean) => void;
}

export const StreamingDownloadPanel: React.FC<StreamingDownloadPanelProps> = ({
  sources,
  onVideoSourceChange,
}) => {
  const [selectedQuality, setSelectedQuality] = useState<string>("v720p");
  const [selectedServer, setSelectedServer] = useState<string>("main");
  const [selectedHost, setSelectedHost] = useState<string>("");
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [servers, setServers] = useState<ServerOption[]>([]);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");
  const [showDownloadLinks, setShowDownloadLinks] = useState(false);

  // Available video qualities
  const qualityOptions: QualityOption[] = useMemo(
    () => [
      { value: "v1080p", label: "1080p" },
      { value: "v720p", label: "720p" },
      { value: "v480p", label: "480p" },
      { value: "v360p", label: "360p" },
    ],
    []
  );

  // Host priority order - wrap in useMemo to prevent recreation on each render
  const hostPriority = useMemo(
    () => ["mp4upload", "doodstream", "krakenfiles", "filelions", "pixeldrain"],
    []
  );

  // Helper to format server names
  const formatServerName = useCallback((serverName: string): string => {
    switch (serverName) {
      case "filelions":
        return "FileLions";
      case "doodstream":
        return "DoodStream";
      case "pixeldrain":
        return "PixelDrain";
      case "mp4upload":
        return "MP4Upload";
      case "krakenfiles":
        return "KrakenFiles";
      default:
        return serverName.charAt(0).toUpperCase() + serverName.slice(1);
    }
  }, []);

  // Helper to find highest available quality
  const findHighestAvailableQuality = useCallback(
    (embedSources: Sources["embed"]): string => {
      for (const quality of ["v1080p", "v720p", "v480p", "v360p"]) {
        const qualitySources = embedSources[quality as keyof Sources["embed"]];

        // Check if at least one host is available
        if (
          qualitySources &&
          Object.values(qualitySources).some((url) => url !== null)
        ) {
          return quality;
        }
      }

      return "v720p"; // Default fallback
    },
    []
  );

  // Helper to find preferred server (non-m3u8)
  const findPreferredServer = useCallback(
    (sourcesData: Sources): string => {
      for (const host of hostPriority) {
        if (sourcesData.embed.v720p[host as keyof MirrorEmbed]) {
          return host;
        }
      }
      return "main"; // fallback to main if no alternative found
    },
    [hostPriority]
  );

  // Update video URL based on selections
  const updateVideoUrl = useCallback(
    (sourcesData: Sources, server: string, quality: string, host: string) => {
      let url = "";
      let isHLS = false;

      if (server === "main") {
        url = sourcesData.main;
        // Cek apakah URL adalah m3u8
        if (url.includes(".m3u8")) {
          isHLS = true;
        }
      } else {
        // If server is one of the embed hosts
        const embedSources =
          sourcesData.embed[quality as keyof Sources["embed"]];

        if (host) {
          // If host is selected, use that
          url = embedSources[host as keyof MirrorEmbed] || "";
        } else {
          // Otherwise, select first available host based on priority
          for (const hostName of hostPriority) {
            const hostUrl = embedSources[hostName as keyof MirrorEmbed];
            if (hostUrl) {
              setSelectedHost(hostName);
              url = hostUrl;
              break;
            }
          }
        }
      }

      setCurrentVideoUrl(url);
      onVideoSourceChange(url, isHLS);
    },
    [hostPriority, onVideoSourceChange]
  );

  // Initialize available servers
  useEffect(() => {
    if (!sources) return;

    // Setup available servers
    const serverList: ServerOption[] = [
      { value: "main", label: "Default Server", type: "main" },
    ];

    // Add embed servers
    if (sources.embed) {
      // Get available hosts from v720p (most common)
      const availableHosts = sources.embed.v720p;

      Object.entries(availableHosts).forEach(([host, url]) => {
        if (url) {
          serverList.push({
            value: host,
            label: formatServerName(host),
            type: "embed",
          });
        }
      });
    }

    setServers(serverList);

    // Set default quality (720p or highest available)
    setSelectedQuality(findHighestAvailableQuality(sources.embed));

    // Periksa apakah main source adalah m3u8
    if (sources.main.includes(".m3u8")) {
      // Cari server alternatif
      const alternativeServer = findPreferredServer(sources);
      if (alternativeServer) {
        setSelectedServer(alternativeServer);
      }
    }

    // Set default video URL
    updateVideoUrl(sources, selectedServer, selectedQuality, "");
  }, [
    sources,
    formatServerName,
    findHighestAvailableQuality,
    findPreferredServer,
    updateVideoUrl,
    selectedServer,
    selectedQuality,
  ]);

  // Update video URL when selections change
  useEffect(() => {
    if (sources) {
      updateVideoUrl(sources, selectedServer, selectedQuality, selectedHost);
    }
  }, [selectedServer, selectedQuality, selectedHost, sources, updateVideoUrl]);

  // Handler for server change
  const handleServerChange = (serverValue: string) => {
    setSelectedServer(serverValue);
    setSelectedHost(""); // Reset host when server changes
    setShowServerMenu(false);
  };

  // Handler for quality change
  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
    setShowQualityMenu(false);

    // Reset host because different quality might have different hosts
    setSelectedHost("");
  };

  // Handler for download toggle
  const handleDownloadToggle = () => {
    setShowDownloadLinks(!showDownloadLinks);
  };

  // Get available download links for current quality
  const getDownloadLinks = () => {
    if (!sources) return [];

    const downloadLinks: { name: string; url: string }[] = [];
    const qualityDownloads =
      sources.download[selectedQuality as keyof Sources["download"]];

    Object.entries(qualityDownloads).forEach(([host, url]) => {
      if (url) {
        downloadLinks.push({
          name: formatServerName(host),
          url: url,
        });
      }
    });

    return downloadLinks;
  };

  return (
    <div className="bg-gray-900/30 backdrop-blur-sm p-4 rounded-lg border border-purple-500/20">
      <div className="flex flex-col h-full">
        <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <Settings size={16} className="text-purple-400" />
          <span>Pengaturan Video</span>
        </h3>

        <div className="flex flex-col gap-3">
          {/* Server Selection */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Server</label>
            <div className="relative">
              <button
                onClick={() => setShowServerMenu(!showServerMenu)}
                className="flex items-center justify-between w-full px-3 py-2 bg-gray-800 rounded-md text-sm text-gray-200 hover:bg-gray-700 transition-colors"
              >
                <span>
                  {selectedServer === "main"
                    ? "Default Server"
                    : formatServerName(selectedServer)}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    showServerMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showServerMenu && (
                <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                  {servers.map((server) => (
                    <button
                      key={server.value}
                      onClick={() => handleServerChange(server.value)}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                    >
                      <span>{server.label}</span>
                      {selectedServer === server.value && (
                        <Check size={16} className="text-purple-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quality Selection */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Kualitas</label>
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="flex items-center justify-between w-full px-3 py-2 bg-gray-800 rounded-md text-sm text-gray-200 hover:bg-gray-700 transition-colors"
              >
                <span>
                  {qualityOptions.find((q) => q.value === selectedQuality)
                    ?.label || "Pilih Kualitas"}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    showQualityMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showQualityMenu && (
                <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                  {qualityOptions.map((quality) => {
                    // Check if this quality is available
                    let isAvailable = false;
                    if (
                      sources.embed[quality.value as keyof Sources["embed"]]
                    ) {
                      const qualitySources =
                        sources.embed[quality.value as keyof Sources["embed"]];
                      isAvailable = Object.values(qualitySources).some(
                        (url) => url !== null
                      );
                    }

                    return (
                      <button
                        key={quality.value}
                        onClick={() => handleQualityChange(quality.value)}
                        disabled={!isAvailable}
                        className={`flex items-center justify-between w-full px-3 py-2 text-sm ${
                          isAvailable
                            ? "text-gray-200 hover:bg-gray-700"
                            : "text-gray-500 cursor-not-allowed"
                        } transition-colors`}
                      >
                        <span>{quality.label}</span>
                        {selectedQuality === quality.value && (
                          <Check size={16} className="text-purple-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Download Button */}
          <div className="mt-2">
            <button
              onClick={handleDownloadToggle}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-purple-700/60 hover:bg-purple-700/80 rounded-md text-sm text-white transition-colors"
            >
              <Download size={16} />
              <span>
                Download{" "}
                {qualityOptions.find((q) => q.value === selectedQuality)?.label}
              </span>
            </button>

            {/* Download Links */}
            {showDownloadLinks && (
              <div className="mt-2 p-3 bg-gray-800/80 rounded-md">
                <h4 className="text-xs font-medium text-gray-300 mb-2">
                  Link Download:
                </h4>
                <div className="space-y-2">
                  {getDownloadLinks().map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-3 py-1.5 bg-gray-700/60 hover:bg-gray-600/60 rounded text-xs text-white transition-colors"
                    >
                      <span>{link.name}</span>
                      <ExternalLink size={12} />
                    </a>
                  ))}

                  {getDownloadLinks().length === 0 && (
                    <p className="text-gray-400 text-xs text-center">
                      Tidak ada link download tersedia
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* External Link */}
          <div className="mt-auto pt-2">
            <Link
              href={currentVideoUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-gray-700/60 hover:bg-gray-600/60 rounded-md text-sm text-white transition-colors"
            >
              <ExternalLink size={16} />
              <span>Buka di tab baru</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
