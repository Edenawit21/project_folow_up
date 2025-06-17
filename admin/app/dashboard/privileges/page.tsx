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
          className="flex items-center gap-2 px-4 py-2 shadow bg-green-600 text-white hover:bg-green-700 rounded-full"
        >
          <Plus size={18} />
          Create Permission
        </button>
      </div>

      <PrivilegeList key={refreshKey} />

      {isAddOpen && (
        <>
          {/* Modal Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsAddOpen(false)}
          />

          {/* Modal Content */}
          <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800">
            <AddPrivilege onClose={() => setIsAddOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
