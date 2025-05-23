"use client";

import React from "react";
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

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[var(--background)] shadow-sm border-b border-[var(--border)]">
      {/* Left: Sidebar Toggle & Search */}
      <div className="flex items-center gap-6 p">
        {isSidebarCollapsed && (
          <>
            <button
              aria-label="Open Sidebar"
              onClick={() => dispatch(setIsSidebarCollapsed(false))}
              className="p-1 hover:opacity-80"
            >
              <Menu className="h-6 w-6 text-[var(--text)] cursor-pointer" />
            </button>

            <Image src="/logo.png" alt="Logo" width={30} height={50} />
          </>
        )}

        <div className="relative w-50">
          <Search className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md  bg-white text-[var(--text)] pl-8 pr-2 py-2 placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right: Theme, Settings, User */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          aria-label="Toggle Theme"
          className="rounded p-2 hover:bg-bg-[var(--background)] hover:bg-[var(--background)] transition-colors"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-[var(--text)]" />
          ) : (
            <Moon className="h-5 w-5 text-[var(--text)]" />
          )}
        </button>

        {/* Settings */}
        <Link
          href="/settings"
          aria-label="Settings"
          className="rounded p-2 hover:bg-[var(--background)] dark:hover:bg-gray-700 transition-colors"
        >
          <Settings className="h-5 w-5 text-[var(--text)]" />
        </Link>

        {/* Divider */}
        <div className="hidden md:block h-6 w-px bg-[var(--border)] mx-2" />

        {/* User */}
        <div className="hidden md:flex items-center justify-center">
          <User className="h-6 w-6 text-[var(--text)] cursor-pointer" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
