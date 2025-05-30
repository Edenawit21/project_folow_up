"use client";
import PrivilegeList from "@/components/privileges/PrivilegeList";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Plus } from "lucide-react";

export default function PrivilegeListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCreateClick = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/privileges/add_privilege");
      setLoading(false);
    }, 300);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Privileges
        </h1>
        <button
          onClick={handleCreateClick}
          aria-label="Create new privilege"
          title="Create new privilege"
          disabled={loading}
          className={`
            flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-[1px] shadow-md
            hover:bg-green-700 hover:shadow-lg
            focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-75
            transition-transform duration-200
            ${loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
            ${loading ? "scale-95" : "hover:scale-105"}
          `}
        >
          {/* Lucide React Plus icon */}
          <Plus size={24} strokeWidth={2} aria-hidden="true" />

          {loading ? (
            <span className="animate-spin inline-block border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
          ) : (
            "Create Privilege"
          )}
        </button>
      </div>

      <PrivilegeList />
    </div>
  );
}
