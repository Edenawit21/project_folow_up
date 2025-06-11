"use client";

import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import UserList from "@/components/users/UserList";
import AddUser from "@/components/users/AddUser";

export default function UsersPage() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="p-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md shadow bg-green-600 text-white "
        >
          <UserPlus size={20} />
          Create User
        </button>
      </div>

      <UserList />

      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4 py-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-xl w-full relative overflow-y-auto max-h-[90vh] p-6">
            <AddUser onClose={() => setIsCreating(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
