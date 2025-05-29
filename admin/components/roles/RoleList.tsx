"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

interface Role {
  id: number;
  name: string;
}

const RoleList = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    // Fetch roles from API when available
    // Example:
    // fetch("/api/roles")
    //   .then(res => res.json())
    //   .then(data => setRoles(data));
  }, []);

  const handleEdit = (id: number) => {
    console.log("Edit role:", id);
    // TODO: Redirect or open modal
  };

  const handleDelete = (id: number) => {
    console.log("Delete role:", id);
    // TODO: API call to delete
  };

  return (
    <div className="w-[700px] ml-[200px] mt-10 p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Role List
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {roles.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  No roles found.
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    {role.name}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <button
                      onClick={() => handleEdit(role.id)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      title="Edit"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleList;
