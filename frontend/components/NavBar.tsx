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
  const isDarkMode = useAppSelector((state) => state.global.isdarkMode);

  return (
    <nav className="flex items-center justify-between h-16 px-6 bg-gray-3000 text-white">
      {/* Left Section: Menu, Logo, Search */}
      <div className="flex items-center gap-6 w-full max-w-xl">
        {/* Menu toggle button */}
        <button
          aria-label="Toggle sidebar"
          onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          className="rounded-lg p-2 dark:hover:bg-gray-800"
        >
          <Menu className="h-6 w-6 text-gray-900  dark:text-gray-300 cursor-pointer " />
        </button>

        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
          className="rounded-full dark:border-gray-600 bg-white p-1"
        />

        {/* Search Bar */}
        <div className="relative hidden md:flex flex-grow ml-16 max-w-md">
          {/* Search icon inside input */}
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Search className="h-5 w-5 text-gray-900 dark:text-gray-400" />
          </div>

          <input
            type="search"
            placeholder="Search..."
            className="w-64 rounded-md bg-gray-100 dark:bg-gray-800 py-2 pl-10 pr-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
      </div>
      {/* Right Section: Icons */}
      <div className="flex items-center gap-4">
        {/* Dark mode toggle */}
        <button
          aria-label="Toggle dark mode"
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className="rounded-lg p-2 dark:hover:bg-gray-800 "
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-gray-900 hover:text-yellow-400 cursor-pointer" />
          ) : (
            <Moon className="h-5 w-5 text-gray-900 cursor-pointer hover:text-yellow-400" />
          )}
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="rounded-lg p-2 dark:hover:bg-gray-800"
        >
          <Bell className="h-5 w-5 dark:text-gray-300 cursor-pointer text-gray-900  hover:text-red-400" />
        </button>

        {/* Account */}
        <button
          aria-label="Account"
          className="rounded-lg p-2 dark:hover:bg-gray-800"
        >
          <User className="h-5 w-5 dark:text-gray-300 cursor-pointer text-gray-900  hover:text-blue-500" />
        </button>

        {/* Settings */}
        <Link
          href="/settings"
          aria-label="Settings"
          className="rounded-lg p-2 dark:hover:bg-gray-800"
        >
          <Settings className="h-5 w-5 dark:text-gray-300 text-gray-900  hover:text-indigo-400" />
        </Link>

        {/* Logout */}
        <button
          aria-label="Logout"
          onClick={() => {
            console.log("Logging out...");
          }}
          className="rounded-lg p-2 dark:hover:bg-gray-800"
        >
          <h1 className="h-5 w-5 dark:text-gray-300 cursor-pointer hover:text-red-600 text-gray-900">
            Logout
          </h1>
          {/* <LogOut className="h-5 w-5 text-gray-900  dark:text-gray-300 cursor-pointer hover:text-red-600" /> */}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
