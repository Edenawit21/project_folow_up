"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchPrivileges, deletePrivilege } from "@/utils/privilegeApi";
import { PrivilegeResponse } from "@/types";
import { Pencil, Trash2 } from "lucide-react";

const PrivilegeList: React.FC = () => {
  const [privileges, setPrivileges] = useState<PrivilegeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadPrivileges();
  }, []);

  const loadPrivileges = async () => {
    try {
      const data = await fetchPrivileges();
      setPrivileges(data);
      console.log("Fetched privileges:", data);
    } catch (error) {
      toast.error("Failed to load privileges.");
    }
  };

  const handleEdit = (privilege: PrivilegeResponse) => {
    // Optional toast
    toast.info(`Editing privilege: ${privilege.permissionName}`);

    // Navigate to edit page with ID as query param or route param
    router.push(`/dashboard/privileges/add_privilege?id=${privilege.id}`);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this privilege?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await deletePrivilege(id);
      toast.success("Privilege deleted successfully.");
      loadPrivileges();
    } catch (error) {
      toast.error("Failed to delete privilege.");
    } finally {
      setLoading(false);
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
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {p.permissionName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                    {p.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {p.action}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 flex gap-4">
                    <button
                      onClick={() => handleEdit(p)}
                      className="hover:text-blue-600 cursor-pointer"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="hover:text-red-600 cursor-pointer"
                      disabled={loading}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
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
