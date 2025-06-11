"use client";

import { useState } from "react";
import { X, Menu } from "lucide-react";
import { MenuContainer } from "@/components/Menu/menuRenderer/MenuContainer";
import Image from "next/image";
export const SideBar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Toggle Button - Always visible on small screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-20 md:hidden bg-gray-200 p-2 rounded-md shadow"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      {isOpen && (
        <aside className="fixed  flex-col h-screen w-64 border-r bg-white dark:bg-gray-900 dark:border-gray-800 overflow-y-auto z-10 hidden md:block">
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <Image src="/logo.png" alt="logo" width={40} height={30} />
              {/* Desktop toggle (optional) */}
              <button
                className="md:hidden text-sm text-gray-500"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
            <MenuContainer />
          </div>
        </aside>
      )}
    </>
  );
};
