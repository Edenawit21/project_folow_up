"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Edit2, Loader2 } from "lucide-react";
import { RoleData } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchAllRoles, deleteRole } from "@/utils/roleApi";

const RoleList = () => {
  const router = useRouter();
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const apiResponse = await fetchAllRoles();
        const roleData: RoleData[] = apiResponse.value || [];
        setRoles(roleData);
      } catch (error) {
        toast.error("Failed to load roles.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEdit = (role: RoleData) => {
    router.push(`/dashboard/roles/create_role?id=${role.roleId}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    try {
      await deleteRole(id);
      setRoles((prev) => prev.filter((r) => r.roleId !== id));
      toast.success("Role deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete role.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Role Management
        </h2>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {[
                  "Name",
                  "Description",
                  "Permissions",
                  "Created At",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
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
                      <span>Loading roles...</span>
                    </div>
                  </td>
                </tr>
              ) : roles.length > 0 ? (
                roles.map((role) => (
                  <tr
                    key={role.roleId}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {role.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[280px]">
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[30ch]">
                        {role.description || (
                          <span className="italic text-gray-400">
                            No description
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[280px]">
                        {Array.isArray(role.permissions) &&
                        role.permissions.length > 0 ? (
                          role.permissions.map((perm, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            >
                              {perm}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500 italic">
                            No permissions
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {role.createdAt
                        ? new Date(role.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(role)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                          aria-label={`Edit ${role.name}`}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(role.roleId)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          aria-label={`Delete ${role.name}`}
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
                    className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No roles found.
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

export default RoleList;
