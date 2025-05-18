"use client";

import React, { useEffect } from "react";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/Sidebar";
import StoreProvider, { useAppSelector, useAppDispatch } from "./redux";

function DashboardWLayout({ children }: { children: React.ReactNode }) {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    // Apply dark mode class to <html>
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  console.log("Dark Mode:", isDarkMode);

  return (
    <div className="flex h-screen w-full dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      {/* Overlay backdrop removed because no mobile logic */}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-[60] h-full
           dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transition-width duration-300 ease-in-out
          ${isSidebarCollapsed ? "w-16" : "w-64"}
        `}
        aria-label="Sidebar Navigation"
      >
        <SideBar />
      </aside>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 min-h-screen pt-16 transition-all duration-300
          ${isSidebarCollapsed ? "md:pl-16" : "md:pl-64"}
        `}
      >
        <header
          className={`fixed top-0 left-0 right-0 z-[70] h-16
     border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-800 backdrop-blur-sm
    transition-all duration-300
  `}
        >
          <NavBar />
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}

// Redux Provider wrapper
const DashboardWrapper = ({ children }: { children: React.ReactNode }) => (
  <StoreProvider>
    <DashboardWLayout>{children}</DashboardWLayout>
  </StoreProvider>
);

export default DashboardWrapper;
