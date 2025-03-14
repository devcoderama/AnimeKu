"use client";

import React, { useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import {
  Home,
  Tags,
  RefreshCw,
  Star,
  Calendar,
  SunMoon,
  HeartHandshake,
  X,
  Film,
  Sparkles,
  FileText,
} from "lucide-react";

interface ButtonSidebarMobileProps {
  children: React.ReactNode;
  icon?: React.ElementType;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  href?: string;
  external?: boolean;
}

const ButtonSidebarMobile: React.FC<ButtonSidebarMobileProps> = ({
  children,
  icon: Icon,
  isActive = false,
  onClick,
  className = "",
  href = "#",
  external = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseStyles =
    "w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ease-in-out";

  const activeStyles = isActive
    ? "bg-gradient-to-r from-indigo-700/80 to-purple-700/80 text-gray-100 shadow-md shadow-indigo-900/30 backdrop-blur-sm"
    : "text-gray-300 hover:bg-gray-800/60 hover:text-indigo-200 backdrop-blur-sm";

  const renderContent = () => (
    <div className="flex items-center space-x-3 w-full">
      {Icon && (
        <div
          className={`transform transition-transform duration-300 
            ${
              isPressed
                ? "scale-75"
                : "group-hover:rotate-6 group-hover:scale-110"
            }
            ${isActive ? "text-gray-100" : ""}`}
        >
          <Icon
            className={`h-5 w-5 ${
              isActive
                ? "text-gray-100"
                : "text-gray-400 group-hover:text-indigo-300"
            }`}
          />
        </div>
      )}
      <span className="flex-grow">{children}</span>

      {/* Arrow icon for external links */}
      {external && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 text-gray-400 group-hover:text-indigo-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </div>
  );

  const handleInteractionStart = () => setIsPressed(true);
  const handleInteractionEnd = () => setIsPressed(false);

  // If there's an href prop, render as a link
  if (href && !onClick) {
    return (
      <Link
        href={href}
        onMouseDown={handleInteractionStart}
        onMouseUp={handleInteractionEnd}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
        className={`${baseStyles} ${activeStyles} ${className} group relative overflow-hidden 
          active:scale-[0.98] transition-transform duration-100 ease-in-out`}
        target={external ? "_blank" : "_self"}
        rel={external ? "noopener noreferrer" : ""}
      >
        {renderContent()}
        <span
          className={`absolute bottom-0 left-0 h-0.5 w-full transform scale-x-0 transition-transform duration-300 origin-left 
            ${
              isActive
                ? "bg-gradient-to-r from-indigo-400 to-purple-400"
                : "bg-gradient-to-r from-indigo-500 to-purple-500"
            } 
            group-hover:scale-x-100`}
        />
      </Link>
    );
  }

  // Otherwise render as a button
  return (
    <button
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      className={`${baseStyles} ${activeStyles} ${className} group relative overflow-hidden 
        active:scale-[0.98] transition-transform duration-100 ease-in-out`}
      onClick={onClick}
    >
      {renderContent()}
      <span
        className={`absolute bottom-0 left-0 h-0.5 w-full transform scale-x-0 transition-transform duration-300 origin-left 
          ${
            isActive
              ? "bg-gradient-to-r from-indigo-400 to-purple-400"
              : "bg-gradient-to-r from-indigo-500 to-purple-500"
          } 
          group-hover:scale-x-100`}
      />
    </button>
  );
};

export const SidebarButtons = ({
  isOpen,
  onToggle,
}: {
  isOpen?: boolean;
  onToggle?: () => void;
}) => {
  return (
    <>
      {/* Overlay untuk menutup sidebar saat klik di luar - tampil hanya di mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container - full height di mobile, hidden di desktop */}
      <div
        className={`fixed inset-y-0 right-0 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 md:hidden`}
      >
        <div className="flex flex-col h-full w-80 max-w-[85vw] bg-gradient-to-b from-gray-900 to-gray-950 shadow-xl border-l border-gray-800/70 overflow-hidden">
          {/* Header dengan logo dan tombol tutup */}
          <div className="flex justify-between items-center p-4 border-b border-gray-800/50">
            <div className="flex items-center">
              <div className="relative">
                <Film className="w-6 h-6 text-indigo-400" />
                <Sparkles className="w-3 h-3 text-purple-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div className="ml-2">
                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-indigo-200 to-purple-200">
                  AnimeKU
                </h1>
                <div className="h-0.5 w-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-80"></div>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-indigo-300 transition-colors duration-200 bg-gray-800/50 p-2 rounded-full"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content area dengan scroll */}
          <div className="flex-1 overflow-y-auto py-4 px-4">
            {/* SearchBar di mobile */}
            <div className="mb-6">
              <SearchBar />
            </div>

            {/* Navigation menu */}
            <div className="space-y-1">
              <ButtonSidebarMobile icon={Home} isActive href="/">
                Beranda
              </ButtonSidebarMobile>
              <ButtonSidebarMobile icon={Tags} href="/genres">
                Genres
              </ButtonSidebarMobile>
              <ButtonSidebarMobile icon={RefreshCw} href="/ongoing">
                Ongoing
              </ButtonSidebarMobile>
              <ButtonSidebarMobile icon={Star} href="/popular">
                Popular
              </ButtonSidebarMobile>
              <ButtonSidebarMobile icon={SunMoon} href="/season">
                Season
              </ButtonSidebarMobile>
              <ButtonSidebarMobile icon={Calendar} href="/jadwal-rilis">
                Jadwal Rilis
              </ButtonSidebarMobile>
              <ButtonSidebarMobile
                icon={FileText}
                href="https://api-anime.coderama.lol/"
                external={true}
                className="mt-2 border border-gray-800/50 bg-gray-800/20"
              >
                Dokumentasi API
              </ButtonSidebarMobile>
            </div>

            {/* Tombol Donasi dengan efek khusus */}
            <div className="pt-4 mt-4 border-t border-gray-700/50">
              <ButtonSidebarMobile
                icon={HeartHandshake}
                href="/donate"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-gray-100
                  shadow-md hover:shadow-indigo-700/20 transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10">Dukung Kami</span>
                <span
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300"
                ></span>
                <span
                  className="absolute -inset-10 transform rotate-12 translate-x-32 translate-y-8 bg-gray-200/10 
                  blur-lg group-hover:translate-x-36 transition-transform duration-1000"
                ></span>
              </ButtonSidebarMobile>
            </div>
          </div>

          {/* Footer di sidebar */}
          <div className="p-4 text-xs text-gray-500 border-t border-gray-800/50">
            <p>© 2025 AnimeKU</p>
            <p className="mt-1">Tempat nonton anime subtitle Indonesia.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ButtonSidebarMobile;
