"use client";

import { useState } from "react";
import { X, Menu } from "lucide-react";
import { MenuContainer } from "@/components/Menu/menuRenderer/MenuContainer";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/utils";

export const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const isCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  return (
    <>
      {/* Mobile Toggle (hamburger) — hidden when sidebar is open */}
      {!isOpen && (
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
          ${isCollapsed ? "w-20" : "w-64"}
          transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:block
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm`}
      >
        <div className="flex flex-col h-full relative px-3 py-4">
          {/* Header: Logo + Collapse/Close */}
          <div className="flex items-center justify-between mb-6 px-1">
            <Image
              src="/logo.png"
              alt="logo"
              width={isCollapsed ? 30 : 70}
              height={30}
              className="transition-all duration-200"
            />

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={() => dispatch(setIsSidebarCollapsed(!isCollapsed))}
              className="hidden md:inline-flex p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Close button (mobile only, top right) */}
            <button
              className="md:hidden text-gray-500 dark:text-gray-300"
              onClick={() => setIsOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu content */}
          <div
            className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 ${
              isCollapsed ? "overflow-x-hidden" : ""
            }`}
          >
            <MenuContainer isCollapsed={isCollapsed} />
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
