"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

interface Privilege {
  id: number;
  name: string;
  description: string;
}

const PrivilegeList = () => {
  const [privileges, setPrivileges] = useState<Privilege[]>([]);

  useEffect(() => {
    // TODO: Replace with real API call
    const fetchData = async () => {
      const data = [
        { id: 1, name: "View Users", description: "Can view user list" },
        {
          id: 2,
          name: "Edit Roles",
          description: "Can edit roles and permissions",
        },
      ];
      setPrivileges(data);
    };

    fetchData();
  }, []);

  const handleEdit = (id: number) => {
    console.log("Edit privilege with id:", id);
    // TODO: Navigate to edit page or open modal
  };

  const handleDelete = (id: number) => {
    console.log("Delete privilege with id:", id);
    // TODO: Confirm and delete from backend
    setPrivileges(privileges.filter((priv) => priv.id !== id));
  };

  return (
    <div className="w-full mt-10 p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Privilege List
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {privileges.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center px-4 py-4 text-gray-500">
                  No privileges found.
                </td>
              </tr>
            ) : (
              privileges.map((privilege) => (
                <tr
                  key={privilege.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3">{privilege.name}</td>
                  <td className="px-4 py-3">{privilege.description}</td>
                  <td className="px-4 py-3 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(privilege.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(privilege.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
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

export default PrivilegeList;
