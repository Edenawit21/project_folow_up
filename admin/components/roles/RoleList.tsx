"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Trash2, Edit2, Loader2, Plus, X, Search } from "lucide-react";
import { RoleData } from "@/types/role";
import { toast } from "react-toastify";
import { fetchAllRoles, deleteRole } from "@/utils/roleApi";
import CreateRole from "./CreateRole";
import PaginationFooter from "@/components/footer/PaginationFooter";

const PermissionsDisplay = ({ permissions }: { permissions: string[] }) => {
  const [showAll, setShowAll] = useState(false);
  const displayLimit = 1;

  if (!permissions || permissions.length === 0) {
    return (
      <span className="italic text-gray-400 dark:text-gray-500">
        No permissions
      </span>
    );
  }

  const displayedPermissions = showAll
    ? permissions
    : permissions.slice(0, displayLimit);
  const remainingCount = permissions.length - displayLimit;

  return (
    <div className="flex flex-wrap items-start gap-2 text-green-600 dark:text-green-400 font-medium">
      <div className="flex flex-col gap-1">
        {displayedPermissions.map((perm, idx) => (
          <span
            key={idx}
            className="inline-block px-2 py-0.5 rounded-md text-green-700 dark:text-green-300 text-xs sm:text-sm font-semibold"
          >
            {perm}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        {remainingCount > 0 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
          >
            +{remainingCount} more
          </button>
        )}
        {showAll && (
          <button
            onClick={() => setShowAll(false)}
            className="text-xs text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
};

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
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 mx-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Confirm Deletion
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
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
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalMenus, setTotalMenus] = useState(0);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await fetchAllRoles();
      setRoles(data);
      setTotalMenus(data.length);
    } catch (error) {
      toast.error("Failed to load roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const filteredRoles = useCallback(() => {
    if (!searchQuery) return roles;

    const query = searchQuery.toLowerCase();
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(query) ||
        (role.description && role.description.toLowerCase().includes(query)) ||
        (role.permissions &&
          role.permissions.some((p) => p.toLowerCase().includes(query)))
    );
  }, [roles, searchQuery]);

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

  const filtered = filteredRoles();
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRoles = filtered.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Role Management</h1>
          <p className="mt-1 sm:mt-2 text-gray-600 dark:text-gray-400 italic text-xs sm:text-sm">
            Manage user roles and their permissions
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90" />
          <span>Create Role</span>
        </button>
      </div>
      <div className="mb-5 sm:mb-6">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-800">
        <div className="min-w-[700px] md:min-w-full w-full border-collapse">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
              <tr>
                <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider hidden sm:table-cell">
                  Created At
                </th>
                <th className="px-3 py-3 sm:px-4 sm:py-4 text-center text-xs sm:text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 sm:py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                      <span className="mt-2 sm:mt-3 text-gray-600 dark:text-gray-400 text-sm">
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
                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                        {role.name}
                      </div>
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 max-w-[200px] sm:max-w-xs">
                      <div className="text-gray-600 dark:text-gray-300 whitespace-normal text-xs sm:text-sm">
                        {role.description || (
                          <span className="italic text-gray-400 dark:text-gray-500">
                            No description
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4">
                      <PermissionsDisplay
                        permissions={role.permissions || []}
                      />
                    </td>

                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      {role.createdAt
                        ? new Date(role.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2 sm:space-x-3">
                        <button
                          onClick={() => handleEdit(role.roleId)}
                          className="p-1.5 sm:p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors duration-200 shadow-sm hover:shadow-md"
                          aria-label="Edit role"
                        >
                          <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={(e) => requestDelete(role.roleId, e)}
                          className="p-1.5 sm:p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Delete role"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 sm:py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-12 h-12 sm:w-16 sm:h-16" />
                      <h3 className="mt-3 text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                        No roles found
                      </h3>
                      <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                        {searchQuery
                          ? "No matching roles found. Try a different search."
                          : "Get started by creating a new role"}
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
        totalItems={filtered.length}
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
