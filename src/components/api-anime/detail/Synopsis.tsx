"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

interface SynopsisProps {
  synopsis: string;
  itemVariant: Variants; // Menggunakan tipe Variants bawaan dari framer-motion
}

const Synopsis = ({ synopsis, itemVariant }: SynopsisProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 250; // Batas karakter yang ditampilkan

  const isTooLong = synopsis.length > maxLength;
  const displayText = isExpanded
    ? synopsis
    : synopsis.slice(0, maxLength) + (isTooLong ? "..." : "");

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div className="synopsis mb-6" variants={itemVariant}>
      <h2 className="font-semibold text-xl flex items-center gap-2 text-purple-300 mb-3">
        <Info size={20} />
        <span>Sinopsis</span>
      </h2>
      <div className="text-gray-300 leading-relaxed">
        <p>{displayText}</p>

        {isTooLong && (
          <button
            onClick={toggleExpanded}
            className="mt-2 text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm font-medium transition-colors duration-200"
          >
            {isExpanded ? (
              <>
                <span>Lihat lebih sedikit</span>
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                <span>Lihat selengkapnya</span>
                <ChevronDown size={16} />
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Synopsis;
