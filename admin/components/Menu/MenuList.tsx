"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash2, Loader2, Plus } from "lucide-react";
import { MenuItem } from "@/types/menuTypes"; 
import { deleteMenuItem, fetchAllMenus } from "@/utils/menuApi"; 
import PaginationFooter from "@/components/footer/PaginationFooter"; 
import AddMenu from "./AddMenu"; 

const MenuList: React.FC = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Function to load all menus
  const loadMenus = async () => {
    setLoading(true);
    try {
      const data = await fetchAllMenus();
      setMenus(data);
    } catch (error) {
      console.error("Failed to load menus", error);
      toast.error("Failed to load menus.");
    } finally {
      setLoading(false);
    }
  };

  // Load menus on initial component mount
  useEffect(() => {
    loadMenus();
  }, []);

  // Handle edit button click
  const handleEdit = (id: number) => {
    setEditingId(id);
    setModalOpen(true);
  };

  // Handle create button click
  const handleCreateClick = () => {
    setEditingId(undefined); // Indicate creation mode
    setModalOpen(true);
  };

  // Handle submit from AddMenu modal (for both create and update)
  const handleSubmit = () => {
    loadMenus(); // Reload all menus to get the latest data
    setModalOpen(false); // Close the modal
    setEditingId(undefined); // Reset editing ID
  };

  // Handle menu deletion
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this menu?")) return;

    try {
      setDeletingId(id);
      await deleteMenuItem(id);
      toast.success("Menu deleted successfully.");
      // Optimistically update state instead of full reload for deletion for smoother UX
      setMenus(prev => prev.filter(m => m.id !== id));

      // Adjust current page if the last item on a page was deleted
      if (paginatedMenus.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      toast.error("Failed to delete menu.");
      console.error("Delete menu error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to get parent menu name (still relies on 'menus' state for lookup)
  const getParentName = (parentId: number | null | undefined) => {
    if (!parentId) return "None";
    const parent = menus.find(m => m.id === parentId);
    return parent ? parent.name : "Unknown";
  };

  // Calculate paginated data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedMenus = menus.slice(startIndex, endIndex);
  const totalMenus = menus.length;

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Menu Management
        </h2>
        <button
          onClick={handleCreateClick} // New button for adding menus
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-full shadow"
        >
          <Plus size={18} />
          Add Menu
        </button>
      </header>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-800">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              {/* Updated headers for consistency */}
              {["Name", "Required Permission", "Order", "Parent", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={5} // Ensure colspan matches the number of table headers
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
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {menu.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {menu.requiredPermission || 'None'} {/* Display 'None' if permission is empty */}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {menu.order ?? "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {getParentName(menu.parentId)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => handleEdit(menu.id)}
                        aria-label={`Edit menu ${menu.name}`}
                        disabled={deletingId === menu.id} // Disable edit while deleting
                        className="dark:text-white dark:hover:text-indigo-300 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(menu.id)}
                        aria-label={`Delete menu ${menu.name}`}
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
                  colSpan={5} // Ensure colspan matches the number of table headers
                  className="px-6 py-16 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16" />
                    <h3 className="text-lg font-medium">No menus found</h3>
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

      {/* Add/Edit Menu Modal */}
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
    </div>
  );
};

export default MenuList;