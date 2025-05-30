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
  const [selectedPrivilege, setSelectedPrivilege] = useState<string>("");

  const router = useRouter();

  // Dummy data for privileges (since backend is removed)
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

    // Simulate success
    toast.success("Role created (simulated).");
    router.push("/roles");
  };

  return (
    <div className="w-[500px] ml-64 mt-10 bg-gray-100 dark:bg-gray-800 p-6 rounded-[1px] shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Create Role
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Name */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Role Name
          </label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full px-4 py-2 border rounded-[1px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter role name"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-[1px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter description (optional)"
            rows={3}
          />
        </div>

        {/* Privilege Dropdown */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Assign Privilege
          </label>
          <select
            value={selectedPrivilege}
            onChange={(e) => setSelectedPrivilege(e.target.value)}
            className="w-full px-4 py-2 border rounded-[1px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
            required
          >
            <option value="">Select privilege</option>
            {privileges.map((priv) => (
              <option key={priv.id} value={priv.id}>
                {priv.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
        >
          Create Role
        </button>
      </form>
    </div>
  );
};

export default CreateRole;
