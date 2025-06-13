"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/NavBar";
import { SideBar } from "@/components/SideBar";
import StoreProvider, { useAppSelector } from "./redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Automatically toggle dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      {!isSidebarCollapsed && <SideBar />}

      {/* Main content area */}
      <main
        className={`flex flex-col w-full transition-all duration-300 ${
          isSidebarCollapsed ? "" : "md:ml-64"
        }`}
      >
        <Navbar />
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => (
  <StoreProvider>
    <DashboardLayout>{children}</DashboardLayout>
  </StoreProvider>
);

export default DashboardWrapper;
