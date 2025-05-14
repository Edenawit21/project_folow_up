"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-500 to-purple-500 dark:from-gray-800 dark:to-purple-700 transition-all duration-300 backdrop-blur-lg shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Image
              src="/log.png"
              alt="Protrack Logo"
              width={40}
              height={40}
              className="rounded-full shadow"
            />
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-900 to-blue-900 bg-clip-text text-transparent">
              Protrack
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
