"use client";
import PrivilegeList from "@/components/privileges/PrivilegeList";
import { useRouter } from "next/navigation";
import React from "react";
import { Plus } from "lucide-react";

export default function PrivilegeListPage() {
  const router = useRouter();

  const handleCreateClick = () => {
    router.push("/dashboard/privileges/add_privilege");
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleCreateClick}
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

      <PrivilegeList />
    </div>
  );
}
