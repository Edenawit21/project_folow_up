"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { Permission } from "@/types/privilege";
import { fetchAllPermissions } from "@/utils/privilegeApi";

const PrivilegeList: React.FC = () => {
  const [privileges, setPrivileges] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const data = await fetchAllPermissions();
        setPrivileges(data);
      } catch (error) {
        console.error("Failed to load permissions", error);
        toast.error("Failed to load privileges.");
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, []);

  // TODO: Implement these handlers
  const handleEdit = (id: string) => {
    // e.g. navigate to edit page or open modal
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this privilege?")) return;
    try {
      setDeletingId(id);
      // await deletePrivilege(id); // implement API call
      setPrivileges((prev) => prev.filter((p) => p.id !== id));
      toast.success("Privilege deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete privilege.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <header className="flex items-center justify-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Privilege Management
        </h2>
      </header>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-800">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              {["Name", "Description", "Action", "Created At", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide"
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
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {p.permissionName}
                  </td>
                  <td className="px-6 py-4 max-w-[280px] truncate">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {p.description || (
                        <span className="italic text-gray-400">No description</span>
                      )}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      {p.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => handleEdit(p.id)}
                        aria-label={`Edit privilege ${p.permissionName}`}
                        disabled={deletingId === p.id}
                        className="dark:text-white dark:hover:text-indigo-300 transition-colors"
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
                    <h3 className="text-lg font-medium">No privileges found</h3>
                  </div>
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
