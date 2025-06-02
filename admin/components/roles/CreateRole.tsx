"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Privilege {
  id: string;
  name: string;
}

const CreateRole: React.FC = () => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPrivilege, setSelectedPrivilege] = useState("");

  const router = useRouter();

  const privileges: Privilege[] = [
    { id: "1", name: "View Dashboard" },
    { id: "2", name: "Manage Users" },
    { id: "3", name: "Edit Roles" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      toast.warning("Role name is required.");
      return;
    }

    if (!selectedPrivilege) {
      toast.warning("Please select a privilege.");
      return;
    }

    toast.success("Role created (simulated).");
    router.push("/roles");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="w-[500px] ml-64 mt-10 bg-white dark:bg-gray-800 p-6 rounded-sm border border-gray-200 dark:border-gray-700 shadow-md">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
        Create Role
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        {/* Role Name */}
        <div>
          <label
            htmlFor="roleName"
            className="block mb-2 text-gray-700 dark:text-gray-300 font-medium"
          >
            Role Name
          </label>
          <input
            id="roleName"
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Enter role name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block mb-2 text-gray-700 dark:text-gray-300 font-medium"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description (optional)"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Privilege Select */}
        <div>
          <label
            htmlFor="privilege"
            className="block mb-2 text-gray-700 dark:text-gray-300 font-medium"
          >
            Assign Privilege
          </label>
          <select
            id="privilege"
            value={selectedPrivilege}
            onChange={(e) => setSelectedPrivilege(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select privilege</option>
            {privileges.map((priv) => (
              <option key={priv.id} value={priv.id}>
                {priv.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="w-1/2 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-1/2 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition-colors"
          >
            Create Role
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRole;
