"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2, Loader2, Plus, Search } from "lucide-react";
import { MenuItemSummary } from "@/types/menuTypes";
import { deleteMenuItem, fetchAllMenus } from "@/utils/menuApi";
import PaginationFooter from "@/components/footer/PaginationFooter";
import AddMenu from "./AddMenu";

const MenuList: React.FC = () => {
  const [menus, setMenus] = useState<MenuItemSummary[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<MenuItemSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // New states for confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [menuIdToDelete, setMenuIdToDelete] = useState<number | null>(null);

  const loadMenus = async () => {
    setLoading(true);
    try {
      const data = await fetchAllMenus();
      setMenus(data);
      setFilteredMenus(data);
    } catch (error) {
      console.error("Failed to load menus", error);
      toast.error("Failed to load menus.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  // Filter menus based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = menus.filter((menu) =>
        menu.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMenus(filtered);
      // Reset to first page when search changes
      setCurrentPage(1);
    } else {
      setFilteredMenus(menus);
    }
  }, [searchTerm, menus]);

  const handleEdit = (id: number) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingId(undefined);
    setModalOpen(true);
  };

  const handleSubmit = () => {
    loadMenus();
    setModalOpen(false);
    setEditingId(undefined);
  };

  // Open confirm dialog instead of deleting directly
  const confirmDelete = (id: number) => {
    setMenuIdToDelete(id);
    setConfirmDialogOpen(true);
  };

  // Actual delete logic triggered by dialog confirm
  const handleDeleteConfirmed = async () => {
    if (menuIdToDelete === null) return;

    setConfirmDialogOpen(false);
    setDeletingId(menuIdToDelete);

    try {
      await deleteMenuItem(menuIdToDelete);
      toast.success("Menu deleted successfully.");
      // Update both menus and filteredMenus after deletion
      setMenus((prev) => prev.filter((m) => m.id !== menuIdToDelete));
      setFilteredMenus((prev) => prev.filter((m) => m.id !== menuIdToDelete));

      // Adjust pagination if needed
      if (paginatedMenus.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      toast.error("Failed to delete menu.");
      console.error("Delete menu error:", error);
    } finally {
      setDeletingId(null);
      setMenuIdToDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDialogOpen(false);
    setMenuIdToDelete(null);
  };

  const getParentName = (parentId: number | null | undefined) => {
    if (!parentId) return "None";
    const parent = menus.find((m) => m.id === parentId);
    return parent ? parent.name : "Unknown";
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedMenus = filteredMenus.slice(startIndex, endIndex);
  const totalMenus = filteredMenus.length;

  // Confirmation Dialog Component
  const ConfirmDeleteDialog = () => {
    if (!confirmDialogOpen || menuIdToDelete === null) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-lg">
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
            Confirm Delete
          </h3>
          <p className="mb-6 dark:text-gray-300">
            Are you sure you want to delete this menu? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirmed}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <header className="flex flex-col mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-indigo-500 dark:text-gray-100">
            Menu Management
          </h2>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 px-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-[6px]"
          >
            <Plus size={18} />
            Add Menu
          </button>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-300 italic text-sm">
          Manage and organize menu items for the application.
        </p>
      </header>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-[8px] border border-gray-300 dark:border-gray-400  bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-800">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Required Permission
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Parent
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Actions
              </th>
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
                    <span>Loading menus...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedMenus.length > 0 ? (
              paginatedMenus.map((menu) => (
                <tr
                  key={menu.id}
                  className="border-b border-gray-200 dark:border-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {menu.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-green-500 whitespace-nowrap">
                    {menu.requiredPermission || "None"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {menu.order ?? "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {getParentName(menu.parentId)}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleEdit(menu.id)}
                        disabled={deletingId === menu.id}
                        className="dark:text-white hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => confirmDelete(menu.id)}
                        disabled={deletingId === menu.id}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        {deletingId === menu.id ? (
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
                      {searchTerm
                        ? "No matching menus found"
                        : "No menus found"}
                    </h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                      {searchTerm
                        ? "Try a different search term"
                        : "Get started by adding a new menu"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <AddMenu
              id={editingId ?? 0}
              onClose={() => {
                setModalOpen(false);
                setEditingId(undefined);
              }}
              onCreate={handleSubmit}
              onUpdate={handleSubmit}
            />
          </div>
        </div>
      )}

      {/* Render the confirmation dialog */}
      {confirmDialogOpen && <ConfirmDeleteDialog />}
    </div>
  );
};

export default MenuList;
