"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/utils";
import Image from "next/image";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 py-3 shadow-sm text-gray-900  dark:bg-gray-800 dark:text-white dark:border-gray-700">
      {/* Left: Sidebar Toggle & Search */}
      <div className="flex items-center gap-6">
        {isSidebarCollapsed && (
          <>
            <button
              aria-label="Open Sidebar"
              onClick={() => dispatch(setIsSidebarCollapsed(false))}
              className="p-1 hover:opacity-80 dark:hover:opacity-80"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Image src="/logo.png" alt="Logo" width={70} height={50} />
          </>
        )}

        {/* <div className="relative w-50">
          <Search className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white pl-8 pr-2 py-2 placeholder-gray-500 dark:placeholder-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}
      </div>

      {/* Right: Theme, Settings, User */}
      <div className="flex items-center gap-4 relative">
        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          aria-label="Toggle Theme"
          className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Settings */}
        <Link
          href="/settings"
          aria-label="Settings"
          className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Settings className="h-5 w-5" />
        </Link>

        {/* Divider */}
        <div className="hidden md:block h-6 w-px mx-2 bg-gray-300 dark:bg-gray-600" />

        {/* User Dropdown */}
        <div
          ref={accountRef}
          className="relative hidden md:flex items-center justify-center"
        >
          <button
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Account Menu"
          >
            <User className="h-6 w-6 cursor-pointer" />
          </button>

          {isAccountMenuOpen && (
            <div className="absolute right-0 top-10 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
              <Link
                href="/profile"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  alert("Logging out...");
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
