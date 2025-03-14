"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { NavButtons } from "@/components/Layout/ButtonNavbarDesktop";
import { SidebarButtons } from "@/components/Layout/ButtonSidebarMobile";
import Footer from "@/components/Layout/Footer";
import { Film, Sparkles, Menu, X } from "lucide-react";

// ButtonLayout Component
interface ButtonLayoutProps {
  children: ReactNode;
}

export const ButtonLayout: React.FC<ButtonLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200">
      {/* Animated background elements - warna yang lebih lembut */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-float"></div>
          <div className="absolute top-[40%] left-[60%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-float-delayed"></div>
          <div className="absolute top-[70%] left-[30%] w-80 h-80 bg-gray-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-float-slow"></div>
        </div>
      </div>

      {/* Header Navigation */}
      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled
            ? "bg-gray-900/80 backdrop-blur-md shadow-lg shadow-gray-950/30"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="relative">
                  <Film className="w-8 h-8 text-indigo-300" />
                  <Sparkles className="w-4 h-4 text-purple-200 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div className="ml-2">
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-indigo-200 to-purple-200">
                    AnimeKU
                  </h1>
                  <div className="h-0.5 w-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-80"></div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <NavButtons />

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleSidebar}
                className="flex items-center justify-center w-10 h-10 transition-all duration-300 text-gray-300 hover:text-white bg-gray-800/40 rounded-full"
                aria-label="Toggle sidebar menu"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-indigo-200" />
                ) : (
                  <Menu className="w-5 h-5 text-indigo-200" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <SidebarButtons isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content */}
      <main className="flex-grow relative z-10">{children}</main>

      <Footer />

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes floating {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        @keyframes floating-delayed {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(15px) translateX(-10px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        @keyframes floating-slow {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(10px) translateX(15px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }

        .animate-float {
          animation: floating 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: floating-delayed 12s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: floating-slow 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default {
  ButtonLayout,
};
