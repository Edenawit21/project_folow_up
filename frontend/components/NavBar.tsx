"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Menu,
  Moon,
  Sun,
  Search,
  Settings,
  Bell,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/utils";

const NavBar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center justify-between h-16 px-6 bg-[var(--background)] text-[var(--text)] shadow-sm border-b border-[var(--border)]">
      {/* Left Section */}
      <div className="flex items-center gap-6 w-full max-w-xl">
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          className="rounded-lg p-2 hover:bg-[var(--muted)]"
        >
          <Menu className="h-6 w-6 cursor-pointer" />
        </button>

        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full p-1 border border-[var(--border)]"
        />

        {/* Search Bar */}
        <div className="relative hidden md:flex flex-grow ml-16 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Search className="h-5 w-5 text-[var(--muted)]" />
          </div>
          <input
            type="search"
            placeholder="Search..."
            className="w-64 rounded-md bg-[var(--background)] py-2 pl-10 pr-4 text-sm text-[var(--text)] placeholder-[var(--muted)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Toggle dark mode"
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className="rounded-lg p-2 hover:bg-[var(--muted)]"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-yellow-400 cursor-pointer" />
          ) : (
            <Moon className="h-5 w-5 text-[var(--text)] cursor-pointer" />
          )}
        </button>

        <Link href="/notifications">
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-[var(--muted)]"
          >
            <Bell className="h-5 w-5 text-[var(--text)] cursor-pointer" />
          </button>
        </Link>

        {/* Profile Dropdown */}
        <div className="relative " ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="rounded-lg p-2 hover:bg-[var(--muted)]"
          >
            <User className="h-5 w-5 text-[var(--text)] cursor-pointer" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44  dark:bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg z-50">
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm  dark:hover:bg-[var(--muted)] hover:bg-gray-400"
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-sm dark:hover:bg-[var(--muted)] hover:bg-gray-400"
              >
                Settings
              </Link>
              <button
                onClick={() => console.log("Logging out...")}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-400 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
