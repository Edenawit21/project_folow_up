"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2, Loader2, Plus, Search, X } from "lucide-react";
import { Permission } from "@/types/privilege";
import { fetchAllPermissions, deletePermission } from "@/utils/privilegeApi";
import AddPrivilege from "./AddPrivilege";
import PaginationFooter from "@/components/footer/PaginationFooter";

const PrivilegeList = () => {
  const [privileges, setPrivileges] = useState<Permission[]>([]);
  const [filteredPrivileges, setFilteredPrivileges] = useState<Permission[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
        setFilteredPrivileges(data);
        setTotalItems(data.length);
      } catch (error) {
        toast.error("Failed to load privileges.");
      } finally {
        setLoading(false);
      }
    };

    loadPrivileges();
  }, []);

  // Filter privileges whenever search term changes
  useEffect(() => {
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();

      const filtered = privileges.filter((p) => {
        const nameMatch = p.permissionName?.toLowerCase().includes(lowerSearch);
        const descMatch = p.description?.toLowerCase().includes(lowerSearch);
        const actionMatch = p.action?.toLowerCase().includes(lowerSearch);
        const createdAtMatch = p.createdAt
          ? new Date(p.createdAt)
              .toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
              .toLowerCase()
              .includes(lowerSearch)
          : false;

        return nameMatch || descMatch || actionMatch || createdAtMatch;
      });

      setFilteredPrivileges(filtered);
      setTotalItems(filtered.length);
      setCurrentPage(1);
    } else {
      setFilteredPrivileges(privileges);
      setTotalItems(privileges.length);
    }
  }, [searchTerm, privileges]);

  // Client-side pagination slice
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPrivileges = filteredPrivileges.slice(
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
      setFilteredPrivileges(data);
      setTotalItems(data.length);
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
      toast.success("Privilege deleted successfully");
      const data = await fetchAllPermissions();
      setPrivileges(data);
      setFilteredPrivileges(data);
      setTotalItems(data.length);
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
      {/* Header with gradient text and animated button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Privilege Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 italic text-sm">
            Manage application privileges and access levels
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          <span>Add Privilege</span>
        </button>
      </div>

      {/* Enhanced Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-indigo-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-10 py-2.5 rounded-[7px] border-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300 placeholder-gray-400"
            placeholder="Search privileges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Table with Card Styling */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
              <tr>
                {["Name", "Description", "Action", "Created At", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-4 py-4 text-left text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="h-10 w-10 animate-spin text-indigo-600 dark:text-indigo-400" />
                      <span className="mt-4 text-gray-600 dark:text-gray-400">
                        Loading privileges...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : paginatedPrivileges.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-100 dark:bg-gray-700/50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl w-20 h-20 flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {searchTerm
                          ? "No matching privileges found"
                          : "No privileges found"}
                      </h3>
                      <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md">
                        {searchTerm
                          ? "Try adjusting your search query"
                          : "Get started by adding a new privilege"}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={handleCreate}
                          className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Create Privilege</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedPrivileges.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {p.permissionName}
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-gray-600 dark:text-gray-300 whitespace-normal">
                        {p.description || (
                          <span className="italic text-gray-400 dark:text-gray-500">
                            No description
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 inline-flex text-base leading-5 font-semibold   text-green-500 dark:text-green-300">
                        {p.action}
                      </span>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(p.id)}
                          className="p-2 rounded-lg  text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors duration-200 shadow-sm hover:shadow-md"
                          aria-label="Edit"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          disabled={deletingId === p.id}
                          className="p-2 rounded-lg  text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Enhanced Modals */}
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

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this privilege? This action
                cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.03]"
                >
                  Delete Privilege
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivilegeList;
