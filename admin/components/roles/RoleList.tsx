"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Edit2, Loader2, Plus } from "lucide-react";
import { RoleData } from "@/types/role";
import { toast } from "react-toastify";
import { fetchAllRoles, deleteRole } from "@/utils/roleApi";
import CreateRole from "./CreateRole";
import PaginationFooter from "@/components/footer/PaginationFooter";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="mx-auto bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Confirm Deletion
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {message}
          </p>
        </div>
        <div className="flex justify-center space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalMenus, setTotalMenus] = useState(0);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await fetchAllRoles();
      setRoles(data);
      setTotalMenus(data.length); // Set total count for pagination
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

  const handleCreate = () => {
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

  // Calculate roles to display based on pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRoles = roles.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-indigo-500 dark:text-white">
            Role Management
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400 italic text-sm">
            Manage user roles and their permissions
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white  shadow-md hover:shadow-lg transition-all duration-300 rounded-[6px]"
        >
          <Plus className="w-5 h-5" />
          <span>Create Role</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                      <span className="mt-3 text-gray-600 dark:text-gray-400">
                        Loading roles...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : paginatedRoles.length ? (
                paginatedRoles.map((role) => (
                  <tr
                    key={role.roleId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {role.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-gray-900 dark:text-gray-300 whitespace-normal">
                        {role.description || (
                          <span className="italic text-gray-400 dark:text-gray-500">
                            No description
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[280px]">
                      <div className="flex flex-wrap gap-1 text-green-500 dark:text-green-500 font-medium">
                        {Array.isArray(role.permissions) &&
                        role.permissions.length > 0 ? (
                          role.permissions.map((perm, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-base font-medium "
                            >
                              {perm}
                            </span>
                          ))
                        ) : (
                          <span className="italic text-gray-400 dark:text-gray-500">
                            No permissions
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {role.createdAt
                        ? new Date(role.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(role.roleId)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 dark:text-indigo-400 transition-colors"
                          aria-label="Edit role"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => requestDelete(role.roleId, e)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 dark:text-red-400 transition-colors"
                          aria-label="Delete role"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        No roles found
                      </h3>
                      <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Get started by creating a new role
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 transition-opacity animate-in fade-in">
          <CreateRole
            id={editingId}
            onClose={() => {
              setModalOpen(false);
              setEditingId(undefined);
            }}
            onUpdate={handleUpdate}
            onCreate={handleUpdate}
            success={false}
            data={[]}
          />
        </div>
      )}

      <PaginationFooter
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalItems={totalMenus}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(1);
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to delete this role? This action cannot be undone."
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
