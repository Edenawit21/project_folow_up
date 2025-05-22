"use client";

import React from "react";
import { Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/utils";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <header className="flex items-center justify-between  px-4 py-3  bg-[var(--background)]">
      {/* Left Section: Sidebar Toggle & Search */}
      <div className="flex items-center gap-8">
        {isSidebarCollapsed && (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          >
            <Menu className="h-8 w-8 text-[var(--text)] cursor-pointer" />
          </button>
        )}

        {/* Search Input */}
        <div className="relative w-[200px] flex h-min">
          <Search className="absolute left-[4px] top-1/2 mr-2 h-5 w-5 -translate-y-1/2 transform cursor-pointer text-[var(--muted)]" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none text-[var(--text)]  focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center">
        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className={
            isDarkMode
              ? `rounded p-2 dark:hover:bg-gray-700`
              : `rounded p-2 hover:bg-gray-100`
          }
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6 cursor-pointer text-[var(--text)]" />
          ) : (
            <Moon className="h-6 w-6 cursor-pointe text-[var(--text)]" />
          )}
        </button>

        {/* Settings */}
        <Link
          href="/settings"
          className={
            isDarkMode
              ? `h-min w-min rounded p-2 hover:bg-[var(--background)]`
              : `h-min w-min rounded p-2 hover:bg-gray-100`
          }
        >
          <Settings className="h-5 w-5 cursor-pointer text-[var(--text)]" />
        </Link>

        {/* Divider */}
        <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-[var(--background)] md:inline-block"></div>

        {/* User Icon */}
        <div className="hidden items-center justify-between md:flex">
          <User className="h-6 w-6 cursor-pointer self-center rounded-full text-[var(--text)]" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
