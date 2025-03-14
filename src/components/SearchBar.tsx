"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      clearSearch();
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`relative flex items-center transition-all duration-300 ${
        isFocused
          ? "w-64 bg-gray-800/70 shadow-md shadow-indigo-500/10"
          : "w-48 bg-gray-800/40"
      } rounded-full backdrop-blur-sm overflow-hidden group`}
    >
      <div className="flex items-center flex-grow pl-3 pr-1 py-1.5">
        <Search
          className={`h-4 w-4 transition-colors duration-300 ${
            isFocused
              ? "text-indigo-300"
              : "text-gray-400 group-hover:text-indigo-200"
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Cari anime..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className="ml-2 bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-500 w-full"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="p-1 rounded-full hover:bg-gray-700/50 text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className={`${
          searchTerm
            ? "opacity-100 w-auto px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            : "opacity-0 w-0"
        } transition-all duration-300 text-xs font-medium`}
        disabled={!searchTerm}
      >
        Cari
      </button>
    </form>
  );
};

export default SearchBar;
