"use client";

import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/Sidebar";
import StoreProvider, { useAppSelector, useAppDispatch } from "./redux";
import { setIsSidebarCollapsed } from "@/utils";

function DashboardWLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isdarkMode);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Apply dark mode class to <html>
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Detect if screen is mobile size
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isDarkMode]);

  // Auto-collapse sidebar on mobile when main content is clicked
  const handleMainClick = () => {
    if (isMobile && !isSidebarCollapsed) {
      dispatch(setIsSidebarCollapsed(true));
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100">
      {/* Overlay backdrop for mobile when sidebar is open */}
      {!isSidebarCollapsed && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => dispatch(setIsSidebarCollapsed(true))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-[60] h-full
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          transform transition-transform duration-300 ease-in-out
          ${
            isMobile
              ? isSidebarCollapsed
                ? "translate-x-[-100%]"
                : "translate-x-0 w-64 shadow-lg"
              : isSidebarCollapsed
              ? "w-16 translate-x-0"
              : "w-64 translate-x-0"
          }
        `}
        aria-label="Sidebar Navigation"
      >
        <SideBar />
      </aside>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 min-h-screen pt-16 transition-all duration-300
          ${isMobile ? "pl-0" : isSidebarCollapsed ? "md:pl-16" : "md:pl-64"}
        `}
        onClick={handleMainClick}
      >
        <header
          className={`fixed top-0 left-0 right-0 z-[70] h-16
    bg-white/95 border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-800 backdrop-blur-sm
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
