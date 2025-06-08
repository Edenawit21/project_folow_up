"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Edit2 } from "lucide-react";
import { RoleData } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchAllRoles, deleteRole } from "@/utils/roleApi";

const RoleList: React.FC = () => {
  const router = useRouter();
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const roleData = await fetchAllRoles();
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
    router.push(`/dashboard/roles/edit/${role.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    try {
      await deleteRole(id);
      setRoles((prev) => prev.filter((r) => r.id !== id));
      toast.success("Role deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete role.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
          Role Management
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
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center px-6 py-8 text-gray-500 dark:text-gray-400"
                >
                  Loading...
                </td>
              </tr>
            ) : roles.length > 0 ? (
              roles.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {role.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                    {role.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {role.createdAt
                      ? new Date(role.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => handleEdit(role)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        aria-label={`Edit role ${role.name}`}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                        aria-label={`Delete role ${role.name}`}
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
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleList;
