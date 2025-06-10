"use client";

import UserList from "@/components/users/UserList";
import { useRouter } from "next/navigation";
import { UserPlus, ShieldCheck } from "lucide-react";
import React from "react";

export default function UsersPage() {
  const router = useRouter();

  const handleCreateUser = () => {
    router.push("/dashboard/users/add_user");
  };

  return (
    <div className="p-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="flex justify-end mb-6">
        <button
          onClick={handleCreateUser}
          className="flex items-center gap-2 px-4 py-2 rounded-md shadow bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
        >
          <UserPlus size={20} />
          Create User
        </button>
      </div>

      <UserList  />
    </div>
  );
}
