"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";

const CreateRole: React.FC = () => {
  const [roleName, setRoleName] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.warning("Role name is required.");
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      await axios.post(
        `${apiBaseUrl}/api/admin/roles`,
        { name: roleName },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Role created successfully.");
      router.push("/admin/roles");
    } catch (error: any) {
      console.error("Create role error:", error);
      toast.error(error.response?.data?.message || "Failed to create role.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Create Role
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Role Name
          </label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full px-4 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter role name"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
        >
          Create Role
        </button>
      </form>
    </div>
  );
};

export default CreateRole;
