"use client";

import React, { useState } from "react";
import PrivilegeList from "@/components/privileges/PrivilegeList";
import AddPrivilege from "@/components/privileges/AddPrivilege";
import { Plus } from "lucide-react";

export default function PrivilegeListPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-6 relative">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsAddOpen(true)}
          aria-label="Create new privilege"
          title="Create new privilege"
          className="
            flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-[1px] shadow-md
            hover:bg-green-700 hover:shadow-lg
            focus:outline-none
            transition-transform duration-200 cursor-pointer hover:scale-105
          "
        >
          <Plus size={20} strokeWidth={2} />
          Create Privilege
        </button>
      </div>

      <PrivilegeList key={refreshKey} />

      {isAddOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsAddOpen(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <AddPrivilege onClose={() => setIsAddOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
