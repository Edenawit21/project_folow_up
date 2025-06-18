"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Edit2, Loader2, Plus } from "lucide-react";
import { RoleData } from "@/types/role";
import { toast } from "react-toastify";
import { fetchAllRoles, deleteRole } from "@/utils/roleApi";
import CreateRole from "./CreateRole";

// Reusable confirmation dialog
const ConfirmDialog = ({
  open,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md w-full max-w-sm">
        <p className="text-gray-800 dark:text-gray-200 text-sm mb-6">
          {message}
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-sm rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const RoleList = () => {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

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

  const handleEdit = (id: string) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingId(undefined);
    setModalOpen(true);
  };

  const handleUpdate = () => {
    loadRoles();
    setModalOpen(false);
    setEditingId(undefined);
  };

  const requestDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!targetId) return;

    try {
      await deleteRole(targetId);
      toast.success("Role deleted successfully.");
      loadRoles();
    } catch (error) {
      toast.error("Failed to delete role.");
    } finally {
      setTargetId(null);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Role List
        </h2>
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow transition"
        >
          <Plus size={18} />
          Create Role
        </button>
      </header>

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
                <tr
                  key={role.roleId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-default"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {role.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 max-w-[280px] break-words whitespace-normal">
                    {role.description || (
                      <span className="italic text-gray-400">
                        No description
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-normal max-w-[280px]">
                    {Array.isArray(role.permissions) &&
                    role.permissions.length > 0 ? (
                      role.permissions.join(", ")
                    ) : (
                      <span className="italic text-gray-400 dark:text-gray-500">
                        No permissions
                      </span>
                    )}
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
                        onClick={() => handleEdit(role.roleId)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-white transition-colors"
                        aria-label={`Edit ${role.name}`}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => requestDelete(role.roleId, e)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 ease-out animate-fadeIn">
          <div className="transform transition-all duration-300 ease-out scale-95 animate-scaleIn">
            <CreateRole
              id={editingId}
              onClose={() => {
                setModalOpen(false);
                setEditingId(undefined);
              }}
              onUpdate={handleUpdate}
              onCreate={handleUpdate}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to delete this role?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setTargetId(null);
        }}
      />
    </div>
  );
};

export default RoleList;
