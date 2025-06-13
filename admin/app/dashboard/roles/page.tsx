"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import RoleList from "@/components/roles/RoleList";
import CreateRole from "@/components/roles/CreateRole";

export default function RolesPage() {
  const [showCreateRole, setShowCreateRole] = useState(false);

  const handleCreateRole = () => {
    setShowCreateRole(true);
  };

  const handleCloseModal = () => {
    setShowCreateRole(false);
  };

  return (
    <div className="relative p-4">
      <div className="flex justify-end mb-6">
        <button
          onClick={handleCreateRole}
          className="flex items-center gap-2 px-4 py-2 rounded-full shadow bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
        >
          <Plus size={18} />
          Create Role
        </button>
      </div>

      <RoleList />

      {/* Modal Popup */}
      {showCreateRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CreateRole onClose={handleCloseModal} />
        </div>
      )}
    </div>
  );
}
