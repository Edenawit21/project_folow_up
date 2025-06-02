"use client";
import PrivilegeList from "@/components/privileges/PrivilegeList";
import { useRouter } from "next/navigation";
import React from "react";
import { Plus } from "lucide-react";

export default function PrivilegeListPage() {
  const router = useRouter();

  const handleCreateClick = () => {
    router.push("/privileges/add_privilege");
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCreateClick}
          aria-label="Create new privilege"
          title="Create new privilege"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-2 py-2 rounded-sm transition shadow-md"
        >
          <Plus size={20} strokeWidth={2} />
          Create Privilege
        </button>
      </div>

      <PrivilegeList />
    </div>
  );
}
