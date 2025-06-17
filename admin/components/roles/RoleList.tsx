"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Edit2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { RoleData, RolePayload } from "@/types/role";
import { toast } from "react-toastify";
import { fetchAllRoles, deleteRole } from "@/utils/roleApi";
import CreateRole from "./CreateRole";

const RoleList = () => {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await fetchAllRoles();
      setRoles(data);
    } catch (error) {
      toast.error("Failed to load roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const toggleExpand = (roleId: string) => {
    setExpandedRole(expandedRole === roleId ? null : roleId);
  };

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setModalOpen(true);
  };

  const handleUpdate = () => {
    loadRoles();
    setExpandedRole(null);
  };

  const handleCreate = (data: RolePayload) => {
    loadRoles();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this role?")) return;

    try {
      await deleteRole(id);
      toast.success("Role deleted successfully.");
      loadRoles();
    } catch (error) {
      toast.error("Failed to delete role.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Role List
      </h2>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700">
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
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-white uppercase tracking-wider"
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
                  className="px-4 py-12 text-center text-gray-500 dark:text-gray-300"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                    <span>Loading roles...</span>
                  </div>
                </td>
              </tr>
            ) : roles.length > 0 ? (
              roles.map((role) => (
                <React.Fragment key={role.roleId}>
                  <tr
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                      expandedRole === role.roleId
                        ? "bg-gray-50 dark:bg-gray-700"
                        : ""
                    }`}
                    onClick={() => toggleExpand(role.roleId)}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap flex items-center">
                      {expandedRole === role.roleId ? (
                        <ChevronUp className="mr-2 h-4 w-4" />
                      ) : (
                        <ChevronDown className="mr-2 h-4 w-4" />
                      )}
                      {role.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap max-w-[280px] truncate">
                      {role.description || (
                        <span className="italic text-gray-400">
                          No description
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">
                          {role.permissions.length} permissions
                        </span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {expandedRole === role.roleId
                            ? "Click to collapse"
                            : "Click to expand"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {role.createdAt
                        ? new Date(role.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={(e) => handleEdit(role.roleId, e)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-white transition-colors"
                          aria-label={`Edit ${role.name}`}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(role.roleId, e)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors"
                          aria-label={`Delete ${role.name}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedRole === role.roleId && (
                    <tr className="bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
                      <td colSpan={5} className="px-4 py-3">
                        <div className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                          Permissions:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(role.permissions) &&
                          role.permissions.length > 0 ? (
                            role.permissions.map((perm, i) => (
                              <span
                                key={i}
                                className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full text-xs"
                              >
                                {perm}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm italic text-gray-500 dark:text-gray-400">
                              No permissions
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <CreateRole
            id={editingId}
            onClose={() => {
              setModalOpen(false);
              setEditingId(undefined);
            }}
            onUpdate={handleUpdate}
            onCreate={handleCreate}
          />
        </div>
      )}
    </div>
  );
};

export default RoleList;
