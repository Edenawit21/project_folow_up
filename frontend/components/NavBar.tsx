"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";

export default function NavBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <nav className="bg-gradient-to-r from-gray-600 to-purple-400 text-white sticky top-0 z-50 backdrop-blur-md transition-all duration-300 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full py-4">
          {/* Left: Logo and Title */}
          <div className="flex items-center space-x-4">
            <Image
              src="/log.png"
              alt="Protrack Logo"
              className="rounded-full"
              width={50}
              height={50}
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent transition-all duration-300">
              Protrack
            </h1>
          </div>

          {/* Right: Theme Toggle */}
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
