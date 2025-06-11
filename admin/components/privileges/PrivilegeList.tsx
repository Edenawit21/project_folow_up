"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchPrivileges, deletePrivilege } from "@/utils/privilegeApi";
import { PrivilegeResponse } from "@/types";
import { Pencil, Trash2, Loader2 } from "lucide-react";

const PrivilegeList: React.FC = () => {
  const [privileges, setPrivileges] = useState<PrivilegeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedPrivilege, setSelectedPrivilege] =
    useState<PrivilegeResponse | null>(null);

  useEffect(() => {
    loadPrivileges();
  }, []);

  const loadPrivileges = async () => {
    setLoading(true);
    try {
      const data = await fetchPrivileges();
      setPrivileges(data);
    } catch {
      toast.error("Failed to load privileges.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (privilege: PrivilegeResponse) => {
    toast.info(`Editing privilege: ${privilege.permissionName}`);
    setSelectedPrivilege(privilege);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this privilege?")) return;

    setDeletingId(id);
    try {
      await deletePrivilege(id);
      toast.success("Privilege deleted successfully.");
      await loadPrivileges();
    } catch {
      toast.error("Failed to delete privilege.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <header className="flex items-center justify-center mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
          Privilege Management
        </h2>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {["Name", "Description", "Action", "Created At", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-24 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                      <span>Loading privileges...</span>
                    </div>
                  </td>
                </tr>
              ) : privileges.length > 0 ? (
                privileges.map((p) => (
                  <tr
                    key={p.id}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {p.permissionName}
                    </td>
                    <td className="px-6 py-4 max-w-[280px]">
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[30ch]">
                        {p.description || (
                          <span className="italic text-gray-400">
                            No description
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {p.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(p)}
                          aria-label={`Edit privilege ${p.permissionName}`}
                          disabled={deletingId === p.id}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(p.id)}
                          aria-label={`Delete privilege ${p.permissionName}`}
                          disabled={deletingId === p.id}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          {deletingId === p.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16" />
                      <h3 className="text-lg font-medium">
                        No privileges found
                      </h3>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PrivilegeList;
