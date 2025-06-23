"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2, Loader2, Plus } from "lucide-react";
import { Permission } from "@/types/privilege";
import { fetchAllPermissions, deletePermission } from "@/utils/privilegeApi";
import AddPrivilege from "./AddPrivilege";
import PaginationFooter from "@/components/footer/PaginationFooter";

const PrivilegeList = () => {
  const [privileges, setPrivileges] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch all privileges on mount
  useEffect(() => {
    const loadPrivileges = async () => {
      setLoading(true);
      try {
        const data = await fetchAllPermissions();
        setPrivileges(data);
        setTotalItems(data.length);
      } catch (error) {
        toast.error("Failed to load privileges.");
      } finally {
        setLoading(false);
      }
    };

    loadPrivileges();
  }, []);

  // Client-side pagination slice
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPrivileges = privileges.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Open modal to create new privilege
  const handleCreate = () => {
    setEditingId(undefined);
    setModalOpen(true);
  };

  // Open modal to edit privilege
  const handleEdit = (id: string) => {
    setEditingId(id);
    setModalOpen(true);
  };

  // After add or update, reload privileges and close modal
  const handleUpdate = async () => {
    setModalOpen(false);
    setEditingId(undefined);
    setLoading(true);
    try {
      const data = await fetchAllPermissions();
      setPrivileges(data);
      setTotalItems(data.length);
      // If current page is beyond total pages after update, reset to 1
      const totalPages = Math.ceil(data.length / rowsPerPage);
      if (currentPage > totalPages) setCurrentPage(1);
    } catch {
      toast.error("Failed to reload privileges.");
    } finally {
      setLoading(false);
    }
  };

  // Delete confirmation
  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeletingId(deleteId);
    try {
      await deletePermission(deleteId);
      toast.success("Privilege deleted.");
      // Reload list after deletion
      const data = await fetchAllPermissions();
      setPrivileges(data);
      setTotalItems(data.length);

      // Adjust current page if necessary
      const totalPages = Math.ceil(data.length / rowsPerPage);
      if (currentPage > totalPages) setCurrentPage(1);
    } catch {
      toast.error("Failed to delete privilege.");
    } finally {
      setDeletingId(null);
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-indigo-500 dark:text-white">
            Privilege Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 italic text-sm">
            Manage application permissions and access levels
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-[6px] shadow-md hover:shadow-lg transition-all duration-300 "
        >
          <Plus className="w-5 h-5" />
          <span>Add Privilege</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {["Name", "Description", "Action", "Created At", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                      <span className="mt-3 text-gray-600 dark:text-gray-400">
                        Loading privileges...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : paginatedPrivileges.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        No privileges found
                      </h3>
                      <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Get started by adding a new privilege
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPrivileges.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {p.permissionName}
                    </td>
                    <td className="px-6 py-4 max-w-xs whitespace-normal break-words text-gray-600 dark:text-gray-300">
                      {p.description || (
                        <span className="italic text-gray-400">
                          No description
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-green-500">
                      {p.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(p.id)}
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 dark:text-indigo-400 transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          disabled={deletingId === p.id}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 dark:text-red-400 transition-colors disabled:opacity-50"
                          aria-label="Delete"
                        >
                          {deletingId === p.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <PaginationFooter
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(1);
        }}
      />

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <AddPrivilege
            id={editingId}
            onClose={() => {
              setModalOpen(false);
              setEditingId(undefined);
            }}
            onCreate={handleUpdate}
            onUpdate={handleUpdate}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this privilege? This action cannot
              be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivilegeList;
