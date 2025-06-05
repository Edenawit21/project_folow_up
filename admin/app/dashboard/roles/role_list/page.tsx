"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Plus, ShieldCheck } from "lucide-react";
import RoleList from "@/components/roles/RoleList";

export default function RolesPage() {
  const router = useRouter();

  const handleCreateRole = () => {
    router.push("/dashboard/roles/create_role");
  };

  const handleAssignPrivileges = () => {
    router.push("/roles/assign_privilege");
  };

  return (
    <div className="relative p-4">
      {/* Top Buttons: Left and Right */}
      <div className="flex justify-end mb-6">
        {/* Left: Assign Privileges */}

        {/* Right: Create Role */}
        <button
          onClick={handleCreateRole}
          className="flex items-center gap-2 px-4 py-2 rounded-md shadow bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
        >
          <Plus size={18} />
          Create Role
        </button>
      </div>

      <RoleList />
    </div>
  );
}
