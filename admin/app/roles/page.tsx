"use client";

import React from "react";
import Role from "@/components/roles/RoleList";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function RolesPage() {
  const router = useRouter();

  const handleCreateRole = () => {
    router.push("/create_role"); 
  };

  return (
    <div className="relative p-4">
      <button
        onClick={handleCreateRole}
        className="absolute top-4 right-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
      >
        <Plus size={18} />
        Create Role
      </button>
      <Role roles={[]} />
    </div>
  );
}
