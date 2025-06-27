// "use client";

// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { Pencil, Trash2, Loader2, Plus, Search } from "lucide-react";
// import { MenuItemSummary } from "@/types/menuTypes";
// import { deleteMenuItem, fetchAllMenus } from "@/utils/menuApi";
// import PaginationFooter from "@/components/footer/PaginationFooter";
// import AddMenu from "./AddMenu";

// const MenuList: React.FC = () => {
//   const [menus, setMenus] = useState<MenuItemSummary[]>([]);
//   const [filteredMenus, setFilteredMenus] = useState<MenuItemSummary[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState<number | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingId, setEditingId] = useState<number | undefined>(undefined);
//   const [searchTerm, setSearchTerm] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // New states for confirmation dialog
//   const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
//   const [menuIdToDelete, setMenuIdToDelete] = useState<number | null>(null);

//   const loadMenus = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchAllMenus();
//       setMenus(data);
//       setFilteredMenus(data);
//     } catch (error) {
//       console.error("Failed to load menus", error);
//       toast.error("Failed to load menus.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadMenus();
//   }, []);

//   // Filter menus based on search term
//   useEffect(() => {
//     if (searchTerm) {
//       const lowerSearch = searchTerm.toLowerCase();
//       const filtered = menus.filter((menu) => {
//         const nameMatch = menu.name.toLowerCase().includes(lowerSearch);
//         const permissionMatch = (menu.requiredPermission || "")
//           .toLowerCase()
//           .includes(lowerSearch);
//         const orderMatch = menu.order?.toString().includes(lowerSearch);
//         const parentName = getParentName(menu.parentId).toLowerCase();
//         const parentMatch = parentName.includes(lowerSearch);

//         return nameMatch || permissionMatch || orderMatch || parentMatch;
//       });
//       setFilteredMenus(filtered);
//       setCurrentPage(1);
//     } else {
//       setFilteredMenus(menus);
//     }
//   }, [searchTerm, menus]);

//   const handleEdit = (id: number) => {
//     setEditingId(id);
//     setModalOpen(true);
//   };

//   const handleCreateClick = () => {
//     setEditingId(undefined);
//     setModalOpen(true);
//   };

//   const handleSubmit = () => {
//     loadMenus();
//     setModalOpen(false);
//     setEditingId(undefined);
//   };

//   // Open confirm dialog instead of deleting directly
//   const confirmDelete = (id: number) => {
//     setMenuIdToDelete(id);
//     setConfirmDialogOpen(true);
//   };

//   // Actual delete logic triggered by dialog confirm
//   const handleDeleteConfirmed = async () => {
//     if (menuIdToDelete === null) return;

//     setConfirmDialogOpen(false);
//     setDeletingId(menuIdToDelete);

//     try {
//       await deleteMenuItem(menuIdToDelete);
//       toast.success("Menu deleted successfully.");
//       // Update both menus and filteredMenus after deletion
//       setMenus((prev) => prev.filter((m) => m.id !== menuIdToDelete));
//       setFilteredMenus((prev) => prev.filter((m) => m.id !== menuIdToDelete));

//       // Adjust pagination if needed
//       if (paginatedMenus.length === 1 && currentPage > 1) {
//         setCurrentPage(currentPage - 1);
//       }
//     } catch (error) {
//       toast.error("Failed to delete menu.");
//       console.error("Delete menu error:", error);
//     } finally {
//       setDeletingId(null);
//       setMenuIdToDelete(null);
//     }
//   };

//   const cancelDelete = () => {
//     setConfirmDialogOpen(false);
//     setMenuIdToDelete(null);
//   };

//   const getParentName = (parentId: number | null | undefined) => {
//     if (!parentId) return "None";
//     const parent = menus.find((m) => m.id === parentId);
//     return parent ? parent.name : "Unknown";
//   };

//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const endIndex = startIndex + rowsPerPage;
//   const paginatedMenus = filteredMenus.slice(startIndex, endIndex);
//   const totalMenus = filteredMenus.length;

//   // Confirmation Dialog Component
//   const ConfirmDeleteDialog = () => {
//     if (!confirmDialogOpen || menuIdToDelete === null) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//         <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-lg">
//           <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
//             Confirm Delete
//           </h3>
//           <p className="mb-6 dark:text-gray-300">
//             Are you sure you want to delete this menu? This action cannot be
//             undone.
//           </p>
//           <div className="flex justify-end gap-4">
//             <button
//               onClick={cancelDelete}
//               className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDeleteConfirmed}
//               className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
//             Menu Management
//           </h2>
//           <p className="mt-2 text-gray-600 dark:text-gray-400 italic text-sm">
//             Manage and organize menu items for the application.
//           </p>
//         </div>
//         <button
//           onClick={handleCreateClick}
//           className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group"
//         >
//           <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
//           <span>Add Menu</span>
//         </button>
//       </div>

//       {/* Search Bar */}
//       <div className="mb-6">
//         <div className="relative max-w-md">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <Search className="w-5 h-5 text-gray-400" />
//           </div>
//           <input
//             type="text"
//             className="w-full pl-10 pr-10 py-2.5 rounded-[7px] border-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all duration-300 placeholder-gray-400"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm("")}
//               className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-800">
//         <table className="min-w-full">
//           <thead>
//             <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
//               <th className="px-4 py-4 text-left text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
//                 Name
//               </th>
//               <th className="px-4 py-4 text-left text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
//                 Required Permission
//               </th>
//               <th className="px-4 py-4 text-left text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
//                 Order
//               </th>
//               <th className="px-4 py-4 text-left text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
//                 Parent
//               </th>
//               <th className="px-4 py-4 text-center text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//             {loading ? (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="px-6 py-24 text-center text-gray-500 dark:text-gray-400"
//                 >
//                   <div className="flex flex-col items-center justify-center gap-3">
//                     <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
//                     <span>Loading menus...</span>
//                   </div>
//                 </td>
//               </tr>
//             ) : paginatedMenus.length > 0 ? (
//               paginatedMenus.map((menu) => (
//                 <tr
//                   key={menu.id}
//                   className="border-b border-gray-200 dark:border-gray-700 transition-colors"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">{menu.name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="px-2.5 py-0.5 inline-flex text-base leading-5 font-semibold   text-green-500 dark:text-green-300">
//                       {menu.requiredPermission || "None"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {menu.order ?? "N/A"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {getParentName(menu.parentId)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex justify-center space-x-4">
//                       <button
//                         onClick={() => handleEdit(menu.id)}
//                         disabled={deletingId === menu.id}
//                         className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors duration-200 shadow-sm hover:shadow-md"
//                       >
//                         <Pencil className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => confirmDelete(menu.id)}
//                         disabled={deletingId === menu.id}
//                         className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         {deletingId === menu.id ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <Trash2 className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="px-6 py-16 text-center text-gray-500 dark:text-gray-400"
//                 >
//                   <div className="flex flex-col items-center justify-center gap-3">
//                     <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16" />
//                     <h3 className="text-lg font-medium">
//                       {searchTerm
//                         ? "No matching menus found"
//                         : "No menus found"}
//                     </h3>
//                     <p className="mt-1 text-gray-500 dark:text-gray-400">
//                       {searchTerm
//                         ? "Try a different search term"
//                         : "Get started by adding a new menu"}
//                     </p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <PaginationFooter
//         currentPage={currentPage}
//         rowsPerPage={rowsPerPage}
//         totalItems={totalMenus}
//         onPageChange={setCurrentPage}
//         onRowsPerPageChange={(rows) => {
//           setRowsPerPage(rows);
//           setCurrentPage(1);
//         }}
//       />

//       {modalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4 overflow-y-auto">
//           <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <AddMenu
//               id={editingId ?? 0}
//               onClose={() => {
//                 setModalOpen(false);
//                 setEditingId(undefined);
//               }}
//               onCreate={handleSubmit}
//               onUpdate={handleSubmit}
//             />
//           </div>
//         </div>
//       )}

//       {/* Render the confirmation dialog */}
//       {confirmDialogOpen && <ConfirmDeleteDialog />}
//     </div>
//   );
// };

// export default MenuList;

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
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = menus.filter((menu) => {
        const nameMatch = menu.name.toLowerCase().includes(lowerSearch);
        const permissionMatch = (menu.requiredPermission || "")
          .toLowerCase()
          .includes(lowerSearch);
        const orderMatch = menu.order?.toString().includes(lowerSearch);
        const parentMatch = getParentName(menu.parentId)
          .toLowerCase()
          .includes(lowerSearch);
        return nameMatch || permissionMatch || orderMatch || parentMatch;
      });
      setFilteredMenus(filtered);
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
    setModalOpen(false);
    setEditingId(undefined);
    fetchAllMenus().then((data) => {
      setMenus(data);
      setFilteredMenus(data);
    });
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
      if (paginatedMenus.length === 1 && currentPage > 1) {
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
    return parent ? parent.name : "Unknown";
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedMenus = filteredMenus.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Menu Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 italic text-sm">
            Manage application menus
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90" />
          Add Menu
        </button>
      </div>

      <div className="mb-4 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Permission
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Order
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Parent
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </th>
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
                  <td className="px-4 py-3">
                    {menu.requiredPermission || "None"}
                  </td>
                  <td className="px-4 py-3">{menu.order ?? "-"}</td>
                  <td className="px-4 py-3">{getParentName(menu.parentId)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(menu.id)}
                        disabled={deletingId === menu.id}
                        className="p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-md"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(menu.id)}
                        disabled={deletingId === menu.id}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md"
                      >
                        {deletingId === menu.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
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
                <td
                  colSpan={5}
                  className="text-center py-10 text-gray-500 dark:text-gray-400"
                >
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

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <AddMenu
              id={editingId ?? 0}
              onClose={() => setModalOpen(false)}
              onCreate={handleSubmit}
              onUpdate={handleSubmit}
            />
          </div>
        </div>
      )}

      {confirmDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="text-sm mb-6">
              Are you sure you want to delete this menu? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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

export default MenuList;
