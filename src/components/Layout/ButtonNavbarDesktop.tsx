"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import {
  Home,
  Tags,
  RefreshCw,
  Star,
  Calendar,
  SunMoon,
  HeartHandshake,
  FileText,
  ExternalLink,
} from "lucide-react";

interface ButtonNavbarDesktopProps {
  children: React.ReactNode;
  icon?: React.ElementType;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  href?: string;
  external?: boolean;
}

const ButtonNavbarDesktop: React.FC<ButtonNavbarDesktopProps> = ({
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
    "px-3 py-2 font-medium transition-all duration-300 ease-in-out rounded-md text-sm flex items-center space-x-2 group";

  const activeStyles = isActive
    ? "text-indigo-300 font-semibold bg-gray-800/80 backdrop-blur-sm"
    : "text-gray-300 hover:text-indigo-200 hover:bg-gray-800/50 backdrop-blur-sm";

  const handleInteractionStart = () => setIsPressed(true);
  const handleInteractionEnd = () => setIsPressed(false);

  const renderContent = () => (
    <div className="flex items-center space-x-2">
      {Icon && (
        <div
          className={`transform transition-transform duration-300 
            ${
              isPressed
                ? "scale-75"
                : "group-hover:rotate-6 group-hover:scale-110"
            }
            ${isActive ? "text-indigo-300" : ""}`}
        >
          <Icon
            className={`h-4 w-4 ${
              isActive
                ? "text-indigo-300"
                : "text-gray-400 group-hover:text-indigo-200"
            }`}
          />
        </div>
      )}
      <span>{children}</span>
      {external && (
        <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-indigo-200" />
      )}
    </div>
  );

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
          className={`absolute bottom-0 left-0 h-0.5 w-full transform ${
            isActive ? "scale-x-100" : "scale-x-0"
          } transition-transform duration-300 origin-left 
            ${
              isActive
                ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                : "bg-gradient-to-r from-indigo-400 to-purple-400"
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
        className={`absolute bottom-0 left-0 h-0.5 w-full transform ${
          isActive ? "scale-x-100" : "scale-x-0"
        } transition-transform duration-300 origin-left 
          ${
            isActive
              ? "bg-gradient-to-r from-indigo-500 to-purple-500"
              : "bg-gradient-to-r from-indigo-400 to-purple-400"
          } 
          group-hover:scale-x-100`}
      />
    </button>
  );
};

export const NavButtons = () => {
  const pathname = usePathname();

  // Function to check if a path is active (including partial matches for sub-routes)
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="hidden md:flex items-center space-x-3">
      <div className="flex items-center space-x-1">
        <ButtonNavbarDesktop icon={Home} isActive={isActive("/")} href="/">
          Beranda
        </ButtonNavbarDesktop>
        <ButtonNavbarDesktop
          icon={Tags}
          isActive={isActive("/genres")}
          href="/genres"
        >
          Genres
        </ButtonNavbarDesktop>
        <ButtonNavbarDesktop
          icon={RefreshCw}
          isActive={isActive("/ongoing")}
          href="/ongoing"
        >
          Ongoing
        </ButtonNavbarDesktop>
        <ButtonNavbarDesktop
          icon={Star}
          isActive={isActive("/popular")}
          href="/popular"
        >
          Popular
        </ButtonNavbarDesktop>
        <ButtonNavbarDesktop
          icon={SunMoon}
          isActive={isActive("/season")}
          href="/season"
        >
          Season
        </ButtonNavbarDesktop>
        <ButtonNavbarDesktop
          icon={Calendar}
          isActive={isActive("/jadwal-rilis")}
          href="/jadwal-rilis"
        >
          Jadwal Rilis
        </ButtonNavbarDesktop>
        <ButtonNavbarDesktop
          icon={FileText}
          href="https://api-anime.coderama.lol/"
          external={true}
          className="border border-gray-700/30 bg-indigo-900/20"
        >
          Dokumentasi
        </ButtonNavbarDesktop>
      </div>

      {/* Tambahkan SearchBar di sini */}
      <div className="border-l border-gray-700 pl-3">
        <div className="relative">
          <SearchBar />
        </div>
      </div>

      {/* Tombol Donasi dengan desain khusus */}
      <ButtonNavbarDesktop
        icon={HeartHandshake}
        isActive={isActive("/donate")}
        href="/donate"
        className="ml-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-gray-100
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
      </ButtonNavbarDesktop>
    </div>
  );
};

export default ButtonNavbarDesktop;
