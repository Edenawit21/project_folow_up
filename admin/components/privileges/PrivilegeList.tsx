"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Edit2 } from "lucide-react";
import { toast } from "react-toastify";
import { fetchPrivileges, deletePrivilege } from "@/utils/privilegeApi";
import { PrivilegeResponse } from "@/types";
import { useRouter } from "next/navigation";

const PrivilegeList: React.FC = () => {
  const [privileges, setPrivileges] = useState<PrivilegeResponse[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadPrivileges = async () => {
      try {
        const data = await fetchPrivileges();
        setPrivileges(data);
      } catch (error) {
        toast.error("Failed to load privileges.");
      }
    };

    loadPrivileges();
  }, []);

  const startEdit = (privilege: PrivilegeResponse) => {
    router.push(`/privileges/edit?id=${privilege.id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this privilege?"
    );
    if (!confirmDelete) return;

    try {
      await deletePrivilege(id);
      setPrivileges((prev) => prev.filter((p) => p.id !== id));
      toast.success("Privilege deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete privilege.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
          Privilege Management
        </h2>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Name", "Description", "Created At", "Actions"].map(
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
                    {p.privilegeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                    {p.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label={`Edit privilege ${p.privilegeName}`}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label={`Delete privilege ${p.privilegeName}`}
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
                  colSpan={4}
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
