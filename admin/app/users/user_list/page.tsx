"use client";

import UserList from "@/components/users/UserList";
import { useRouter } from "next/navigation";
import { UserPlus, ShieldCheck } from "lucide-react";
import React from "react";

export default function UsersPage() {
  const router = useRouter();

  const handleCreateUser = () => {
    router.push("/users/add_user");
  };

  const handleAssignRole = () => {
    router.push("/users/assign_role");
  };

  return (
    <div className="p-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="flex justify-between mb-6">
        {/* Left: Assign Role Button */}
        <button
          onClick={handleAssignRole}
          className="flex items-center gap-2 px-4 py-2 rounded-sm shadow bg-gray-200 dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          <ShieldCheck size={20} />
          Assign Role
        </button>

        {/* Right: Create User Button */}
        <button
          onClick={handleCreateUser}
          className="flex items-center gap-2 px-4 py-2 rounded-md shadow bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
        >
          <UserPlus size={20} />
          Create User
        </button>
      </div>

      <UserList token={""} />
    </div>
  );
}
