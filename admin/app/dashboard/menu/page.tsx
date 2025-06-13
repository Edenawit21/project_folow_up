"use client";

import React, { useState } from "react";
import CreateMenu from "@/components/Menu/CreateMenu";
import ListMenu from "@/components/Menu/ListMenu";
import { MenuItem } from "@/types/menuTypes";
import { Plus } from "lucide-react";

export default function Home() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const addMenuItem = (newItem: MenuItem) => {
    setMenus((prev) => [...prev, newItem]);
    setIsCreateOpen(false); // close modal after create
  };

  return (
    <div className="p-6 relative min-h-screen">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsCreateOpen(true)}
          aria-label="Create new menu"
          title="Create new menu"
          className="flex items-center gap-2 px-3 py-2 shadow bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        >
          <Plus size={18} />
          Create Menu
        </button>
      </div>

      <ListMenu items={menus} />

      {isCreateOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsCreateOpen(false)}
          />

          {/* Modal content */}
          <div className="fixed top-1/2 left-1/2 max-w-xl w-full transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-6 z-50">
            <CreateMenu
              onCreate={addMenuItem}
              onCancel={() => setIsCreateOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
}
