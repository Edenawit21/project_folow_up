"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit2 } from "lucide-react";

interface Privilege {
  id: number;
  privilegeName: string;
  description: string;
  createdAt: string;
  action: string;
}

const PrivilegeList: React.FC = () => {
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const router = useRouter();

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockData: Privilege[] = [
      {
        id: 1,
        privilegeName: "EditProject",
        description: "Allows editing of project details",
        createdAt: new Date().toISOString(),
        action: "Edit",
      },
      {
        id: 2,
        privilegeName: "DeleteProject",
        description: "Allows deletion of a project",
        createdAt: new Date().toISOString(),
        action: "Delete",
      },
    ];
    setPrivileges(mockData);
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-center mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
          Privilege Management
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["ID", "Name", "Description", "Created At", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {privileges.length > 0 ? (
              privileges.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {p.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {p.privilegeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                    {p.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-3">
                      <button
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 p-2 hover:bg-blue-700 text-white transition"
                        aria-label="Edit privilege"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        className="inline-flex items-center justify-center rounded-md bg-red-600 p-2 hover:bg-red-700 text-white transition"
                        aria-label="Delete privilege"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No privileges found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrivilegeList;
