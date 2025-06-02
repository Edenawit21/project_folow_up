"use client";

import UserList from "@/components/users/UserList";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import React from "react";

export default function UsersPage() {
  const router = useRouter();

  const handleCreateUser = () => {
    router.push("/users/add_user");
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={handleCreateUser}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-sm shadow"
        >
          <UserPlus size={20} />
          Create User
        </button>
      </div>
      <UserList token={""} />
    </div>
  );
}
