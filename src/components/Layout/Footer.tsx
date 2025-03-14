import React from "react";
import { Film, Heart } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer
      className={`bg-gray-900/80 backdrop-blur-sm border-t border-gray-800/50 ${className} relative`}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/10 to-gray-900/0 pointer-events-none"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Logo dan Deskripsi - Centered */}
          <div className="mb-8 max-w-md">
            <div className="flex items-center justify-center group">
              <div className="relative mr-2">
                <Film className="w-6 h-6 text-indigo-400 transition-transform duration-300 group-hover:rotate-12" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></span>
              </div>
              <h3 className="font-bold text-lg">
                <span className="bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  AnimeKU
                </span>
              </h3>
            </div>
            <p className="text-gray-400 text-xs mt-2 mx-auto">
              Situs streaming anime terlengkap dengan update tercepat. Temukan
              anime favorit Anda dengan mudah.
            </p>
          </div>
        </div>

        {/* Footer Copyright - center aligned */}
        <div className="mt-6 pt-4 border-t border-gray-800/50 text-center text-gray-500 text-xs">
          <p className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0">
            <span className="flex items-center justify-center">
              <Heart className="w-3 h-3 text-pink-500 mr-1 animate-pulse" />©
              2025 AnimeKU
            </span>
            <span className="hidden sm:inline mx-2">|</span>
            <span>Semua data anime diambil dari api-anime.coderama.lol</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
