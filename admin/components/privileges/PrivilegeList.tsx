"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchPrivileges, deletePrivilege } from "@/utils/privilegeApi";
import { PrivilegeResponse } from "@/types";
import { Pencil, Trash2, PlusCircle, Loader2 } from "lucide-react";

const PrivilegeList: React.FC = () => {
  const [privileges, setPrivileges] = useState<PrivilegeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadPrivileges();
  }, []);

  const loadPrivileges = async () => {
    setLoading(true);
    try {
      const data = await fetchPrivileges();
      setPrivileges(data);
    } catch (error) {
      toast.error("Failed to load privileges.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    router.push("/dashboard/privileges/add_privilege");
  };

  const handleEdit = (privilege: PrivilegeResponse) => {
    router.push(`/dashboard/privileges/add_privilege?id=${privilege.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this privilege?")) return;

    try {
      setDeletingId(id);
      await deletePrivilege(id);
      toast.success("Privilege deleted successfully.");
      loadPrivileges();
    } catch (error) {
      toast.error("Failed to delete privilege.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Privilege Management
        </h2>
      </div>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {p.permissionName}
                      </div>
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
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                          aria-label={`Edit privilege ${p.permissionName}`}
                          disabled={deletingId === p.id}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          aria-label={`Delete privilege ${p.permissionName}`}
                          disabled={deletingId === p.id}
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
                      <p className="max-w-md">
                        Get started by creating a new privilege
                      </p>
                      <button
                        onClick={handleCreate}
                        className="mt-3 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        <PlusCircle size={16} />
                        Create Privilege
                      </button>
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
