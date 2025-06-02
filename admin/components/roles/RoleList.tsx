"use client";

import React from "react";
import { Trash2, Edit2 } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface RoleProps {
  roles: Role[];
}

const Role: React.FC<RoleProps> = ({ roles }) => {
  if (roles.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
        No roles found.
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 px-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
        Role Management
      </h1>
      <div className="overflow-auto rounded-sm shadow border border-gray-300 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Role Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Description
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {roles.map((role) => (
              <tr
                key={role.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                  {role.name}
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {role.description || "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
                      aria-label={`Edit role ${role.name}`}
                      // Add your edit handler here
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded bg-red-600 hover:bg-red-700 text-white transition"
                      aria-label={`Delete role ${role.name}`}
                      // Add your delete handler here
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DemoRoleList = () => {
  const demoRoles: Role[] = [
    { id: "1", name: "Admin", description: "Has full system access" },
    { id: "2", name: "Editor", description: "Can edit content" },
    { id: "3", name: "Viewer", description: "Can view content only" },
  ];

  return <Role roles={demoRoles} />;
};

export default DemoRoleList;
