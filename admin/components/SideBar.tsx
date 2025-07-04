// Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";
import { MenuContainer } from "@/components/Menu/menuRenderer/MenuContainer";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/utils";

export const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useAppDispatch();
  const isCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  // Detect mobile screens
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Auto-close sidebar when resizing to desktop
  useEffect(() => {
    if (!isMobile && isOpen) setIsOpen(false);
  }, [isMobile, isOpen]);

  return (
    <>
      {/* Mobile Toggle - Only shows on mobile */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-40 md:hidden bg-gray-100 dark:bg-gray-800 p-2 rounded-md shadow-md"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5 text-gray-700 dark:text-white" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out z-30
          transform dark:shadow-2xl ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } 
          md:translate-x-0 md:block
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden
          ${isCollapsed && !isMobile ? "w-[70px]" : "w-full max-w-[256px]"}`}
      >
        <div className="flex flex-col h-full relative px-3 py-4">
          <div className="flex items-center justify-between mb-6 px-1">
            <Image
              src="/logo.png"
              alt="logo"
              width={isCollapsed && !isMobile ? 30 : 70}
              height={30}
              className="transition-all duration-200"
            />

            {/* Desktop Collapse Toggle */}
            {!isMobile && (
              <button
                onClick={() => dispatch(setIsSidebarCollapsed(!isCollapsed))}
                className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu className="w-8 h-6 text-gray-900 dark:text-gray-300" />
              </button>
            )}

            {/* Mobile Close Button */}
            {isMobile && (
              <button
                className="text-gray-500 dark:text-gray-300"
                onClick={() => setIsOpen(false)}
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className={`flex-1 overflow-y-auto scrollbar-thin`}>
            <MenuContainer isCollapsed={isCollapsed && !isMobile} />
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
