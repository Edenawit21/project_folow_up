"use client";

import React, { useEffect, useState } from "react";

interface Privilege {
  id: number;
  privilageName: string;
  description: string;
  createdAt: string;
  action: string;
}

const PrivilegeList: React.FC = () => {
  const [privileges, setPrivileges] = useState<Privilege[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockData: Privilege[] = [
      {
        id: 1,
        privilageName: "EditProject",
        description: "Allows editing of project details",
        createdAt: new Date().toISOString(),
        action: "Edit",
      },
      {
        id: 2,
        privilageName: "DeleteProject",
        description: "Allows deletion of a project",
        createdAt: new Date().toISOString(),
        action: "Delete",
      },
    ];
    setPrivileges(mockData);
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Privilege List
      </h2>
      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-left text-gray-700 dark:text-gray-200">
            <th className="p-3 border border-gray-300 dark:border-gray-600">
              ID
            </th>
            <th className="p-3 border border-gray-300 dark:border-gray-600">
              Name
            </th>
            <th className="p-3 border border-gray-300 dark:border-gray-600">
              Action
            </th>
            <th className="p-3 border border-gray-300 dark:border-gray-600">
              Description
            </th>
            <th className="p-3 border border-gray-300 dark:border-gray-600">
              Created At
            </th>
          </tr>
        </thead>
        <tbody>
          {privileges.map((p) => (
            <tr
              key={p.id}
              className="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="p-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                {p.id}
              </td>
              <td className="p-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                {p.privilageName}
              </td>
              <td className="p-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                {p.action}
              </td>
              <td className="p-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                {p.description}
              </td>
              <td className="p-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                {new Date(p.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrivilegeList;
