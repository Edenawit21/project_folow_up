"use client";

import { useState } from "react";
import { X, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { MenuContainer } from "@/components/Menu/menuRenderer/MenuContainer";
import Image from "next/image";

export const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-30 md:hidden bg-gray-100 dark:bg-gray-800 p-2 rounded-md shadow"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-700 dark:text-white" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700 dark:text-white" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full ${
          isCollapsed ? "w-20" : "w-64"
        } bg-white dark:bg-gray-800 border-r dark:border-gray-800 z-20 transform transition-all duration-200 ease-in-out
          ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:block`}
      >
        <div className="p-4 h-full flex flex-col relative">
          {/* Top Section */}
          <div className="flex items-center justify-between mb-6">
            {!isCollapsed ? (
              <Image src="/logo.png" alt="logo" width={40} height={30} />
            ) : (
              <Image src="/logo.png" alt="logo" width={30} height={30} />
            )}

            {/* Mobile Close Button */}
            <button
              className="md:hidden text-gray-500 dark:text-gray-300"
              onClick={() => setIsOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu Items */}
          <div className={`flex-1 ${isCollapsed ? "overflow-hidden" : ""}`}>
            <MenuContainer isCollapsed={isCollapsed} />
          </div>

          {/* Collapse/Expand Button */}
          <button
            className="absolute -right-1 top-3 hidden md:block dark:bg-gray-700 dark:border-gray-600 p-1 shadow"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <Menu className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
