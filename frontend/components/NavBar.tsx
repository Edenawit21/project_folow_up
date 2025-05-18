"use client";

import React from "react";
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

  return (
    <nav className="flex items-center justify-between h-16 px-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Left Section: Menu, Logo, Search */}
      <div className="flex items-center gap-6 w-full max-w-xl">
        {/* Menu toggle button */}
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <Menu className="h-6 w-6 text-gray-900 dark:text-gray-300 cursor-pointer" />
        </button>

        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full p-1 border dark:border-gray-600"
        />

        {/* Search Bar */}
        <div className="relative hidden md:flex flex-grow ml-16 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Search className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>

          <input
            type="search"
            placeholder="Search..."
            className="w-64 rounded-md bg-white dark:bg-gray-800 py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
      </div>

      {/* Right Section: Icons */}
      <div className="flex items-center gap-4">
        {/* Dark mode toggle */}
        <button
          type="button"
          aria-label="Toggle dark mode"
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-yellow-400 cursor-pointer" />
          ) : (
            <Moon className="h-5 w-5 text-gray-900 dark:text-gray-300 cursor-pointer" />
          )}
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <Bell className="h-5 w-5 text-gray-900 dark:text-gray-300 cursor-pointer" />
        </button>

        {/* Account */}
        <button
          type="button"
          aria-label="Account"
          className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <User className="h-5 w-5 text-gray-900 dark:text-gray-300 cursor-pointer" />
        </button>

        {/* Settings */}
        <Link
          href="/settings"
          aria-label="Settings"
          className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <Settings className="h-5 w-5 text-gray-900 dark:text-gray-300" />
        </Link>

        {/* Logout */}
        <button
          type="button"
          aria-label="Logout"
          onClick={() => console.log("Logging out...")}
          className="rounded-lg p-2 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <LogOut className="h-5 w-5 text-red-600 dark:text-red-400 cursor-pointer" />
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
