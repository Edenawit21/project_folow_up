"use client";

import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import UserList from "@/components/users/UserList";
import AddUser from "@/components/users/AddUser";
import { UserForm } from "@/types/user";

export default function UsersPage() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="p-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full shadow bg-green-600 text-white "
        >
          <UserPlus size={18} />
          Create User
        </button>
      </div>

      <UserList />

      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4 py-10">
          <AddUser onClose={() => setIsCreating(false)} onCreate={function (data: UserForm): void {
            throw new Error("Function not implemented.");
          } } onUpdate={function (): void {
            throw new Error("Function not implemented.");
          } } />
        </div>
      )}
    </div>
  );
}
