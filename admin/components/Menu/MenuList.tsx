"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2, Loader2, Plus, Search, X } from "lucide-react";
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
  const [editingId, setEditingId] = useState<number | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [menuIdToDelete, setMenuIdToDelete] = useState<number | null>(null);

  useEffect(() => {
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
    loadMenus();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      setFilteredMenus(
        menus.filter((menu) =>
          [menu.name, menu.requiredPermission, menu.order?.toString(), getParentName(menu.parentId)]
            .filter(Boolean)
            .some((val) => val?.toLowerCase().includes(lower))
        )
      );
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

  const handleSubmit = async () => {
    const updated = await fetchAllMenus();
    setMenus(updated);
    setFilteredMenus(updated);
    setModalOpen(false);
    setEditingId(undefined);
  };

  const confirmDelete = (id: number) => {
    setMenuIdToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (menuIdToDelete === null) return;
    setConfirmDialogOpen(false);
    setDeletingId(menuIdToDelete);

    try {
      await deleteMenuItem(menuIdToDelete);
      toast.success("Menu deleted successfully.");
      const updated = menus.filter((m) => m.id !== menuIdToDelete);
      setMenus(updated);
      setFilteredMenus(updated);
      if ((filteredMenus.length - 1) % rowsPerPage === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      toast.error("Failed to delete menu.");
      console.error(error);
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
    return parent?.name || "Unknown";
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedMenus = filteredMenus.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Menu Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 italic text-sm">Manage application menus</p>
        </div>
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90" />
          Add Menu
        </button>
      </div>

      <div className="mb-5 sm:mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
            <tr>
              <th className="px-4 py-4 text-indigo-600 dark:text-indigo-200 font-medium uppercase tracking-wide">Name</th>
              <th className="px-4 py-4 text-indigo-600 dark:text-indigo-200 font-medium uppercase tracking-wide">Permission</th>
              <th className="px-4 py-4 text-indigo-600 dark:text-indigo-200 font-medium uppercase tracking-wide">Order</th>
              <th className="px-4 py-4 text-indigo-600 dark:text-indigo-200 font-medium uppercase tracking-wide">Parent</th>
              <th className="px-4 py-4 text-center text-indigo-600 dark:text-indigo-200 font-medium uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  <Loader2 className="w-6 h-6 mx-auto animate-spin" />
                  Loading...
                </td>
              </tr>
            ) : paginatedMenus.length > 0 ? (
              paginatedMenus.map((menu) => (
                <tr key={menu.id}>
                  <td className="px-4 py-3">{menu.name}</td>
                  <td className="px-4 py-3 text-green-700 dark:text-green-300 font-semibold">{menu.requiredPermission || "None"}</td>
                  <td className="px-4 py-3">{menu.order ?? "-"}</td>
                  <td className="px-4 py-3">{getParentName(menu.parentId)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(menu.id)}
                        disabled={deletingId === menu.id}
                        className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors duration-200"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(menu.id)}
                        disabled={deletingId === menu.id}
                        className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 disabled:opacity-50"
                      >
                        {deletingId === menu.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500 dark:text-gray-400">
                  No menus found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationFooter
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalItems={filteredMenus.length}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(1);
        }}
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <AddMenu id={editingId ?? 0} onClose={() => setModalOpen(false)} onCreate={handleSubmit} onUpdate={handleSubmit} />
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {confirmDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 border dark:border-gray-700">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirm Deletion</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this menu item? This action cannot be undone.</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirmed}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg shadow-md transition-transform duration-200 hover:scale-[1.03]"
                >
                  Delete Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuList;
