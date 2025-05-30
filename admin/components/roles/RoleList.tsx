"use client";

import React from "react";

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
    <div className="max-w-4xl mx-auto mt-10 overflow-auto rounded shadow border border-gray-300 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-200 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Role Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {roles.map((role) => (
            <tr
              key={role.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-6 py-4">{role.name}</td>
              <td className="px-6 py-4">{role.description || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Role;
