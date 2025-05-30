"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import RoleList from "@/components/roles/RoleList";

export default function RolesPage() {
  const router = useRouter();

  const handleCreateRole = () => {
    router.push("/roles/create_role");
  };

  return (
    <div className="relative p-4">
      <button
        onClick={handleCreateRole}
        className="absolute top-4 right-4 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-sm transition shadow-md"
      >
        <Plus size={18} />
        Create Role
      </button>

      <RoleList roles={[]} />
    </div>
  );
}
