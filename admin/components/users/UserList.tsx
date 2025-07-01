"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Trash2, Pencil, Plus, Search, X } from "lucide-react";
import { toast } from "react-toastify";
import { UserData, UserFilterDto } from "@/types/user";
import { getUsers, deleteUser } from "@/utils/userApi";
import { fetchAllRoles } from "@/utils/roleApi";
import AddUser from "./AddUser";
import { RoleData } from "@/types/role";
import PaginationFooter from "@/components/footer/PaginationFooter";
import Link from "next/link";
import { fileURLToPath } from "url";

const UserList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filter, setFilter] = useState<UserFilterDto>({
    PageNumber: 1,
    PageSize: 15,
    SortBy: "Name",
    SortDescending: false,
  });
  const [totalCount, setTotalCount] = useState(0);
  //const debouncedSearchTerm = useDebounce(searchTerm, 9000);
  // Move fetchData to component scope so it can be called elsewhere
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Include search term in the filter if it exists
      const apiFilter = {
        ...filter,
        // Email: debouncedSearchTerm || undefined,
        DisplayName: searchTerm || undefined,
        //FirstName: debouncedSearchTerm || undefined,
        // LastName: debouncedSearchTerm || undefined,
        pageNumber: currentPage,
        pageSize: rowsPerPage,
      };

      const [usersResult, rolesResponse] = await Promise.all([
        getUsers(apiFilter),
        fetchAllRoles(),
      ]);
      console.log("Fetched users:", usersResult);
      console.log("Fetched roles:", rolesResponse);
      const { items, totalCount } = usersResult;
      setUsers(items);
      setTotalCount(totalCount);
      setRoles(rolesResponse);
    } catch (error) {
      toast.error("Failed to fetch users or roles");
      console.error("Error fetching users or roles:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm, currentPage, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingId(undefined);
    setModalOpen(true);
  };

  const handleUpdate = () => {
    fetchData();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser(deleteId);
      toast.success("User deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setDeleteId(null);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1);

    // Apply the same search term to all searchable fields
    setFilter((prev) => ({
      ...prev,
      // Email: term || undefined,
      DisplayName: term || undefined,
      // FirstName: term || undefined,
      // LastName: term || undefined,
      PageNumber: 1,
    }));
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilter((prev) => ({
      ...prev,
      Email: undefined,
      DisplayName: undefined,
      FirstName: undefined,
      LastName: undefined,
      PageNumber: 1,
    }));
  };

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setFilter((prev) => ({ ...prev, PageNumber: page }));
  }, []);

  // Handle rows per page change
  const handleRowsPerPageChange = useCallback((pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize, PageNumber: 1 }));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Users Management</h2>
          <p className="mt-1 sm:mt-2 text-gray-600 dark:text-gray-300 italic text-xs sm:text-sm">
            Manage and organize users in the system.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90" />
          <span> Create User</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-5 sm:mb-6">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800">
        <div className="min-w-[700px] md:min-w-full w-full">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
              <tr>
                <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider hidden sm:table-cell">
                  Source
                </th>
                <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-xs sm:text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider hidden sm:table-cell">
                  Active
                </th>
                <th className="px-3 py-3 sm:px-4 sm:py-4 text-center text-xs sm:text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 sm:py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-indigo-600 dark:border-indigo-400 border-solid rounded-full animate-spin"></div>
                      <span className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                        Loading users...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 sm:py-16 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-12 h-12 sm:w-16 sm:h-16" />
                      <h3 className="mt-3 text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                        {searchQuery
                          ? "No matching users found"
                          : "No users found"}
                      </h3>
                      <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                        {searchQuery
                          ? "Try adjusting your search query"
                          : "Get started by creating a new user"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users
                  .slice(
                    (currentPage - 1) * rowsPerPage,
                    currentPage * rowsPerPage
                  )
                  .map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                        <Link
                          href={`/dashboard/users/${user.id}`}
                          className="block w-full py-2 -my-2 text-sm sm:text-base font-medium text-gray-900 dark:text-white"
                        >
                          {user.displayName ||
                            `${user.firstName} ${user.lastName}`}
                        </Link>
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                        <Link
                          href={`/dashboard/users/${user.id}`}
                          className="block w-full py-2 -my-2 text-sm sm:text-base"
                        >
                          {user.email}
                        </Link>
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4">
                        <Link
                          href={`/dashboard/users/${user.id}`}
                          className="block w-full py-2 -my-2"
                        >
                          <div className="flex flex-wrap gap-1">
                            {user.roles?.map((role, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 text-green-500 dark:text-green-500 text-base "
                              >
                                {role}
                              </span>
                            ))}
                          </div>
                        </Link>
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-indigo-500 dark:text-indigo-400 hidden sm:table-cell">
                        <Link
                          href={`/dashboard/users/${user.id}`}
                          className="block w-full py-2 -my-2"
                        >
                          {user.source}
                        </Link>
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                        <Link
                          href={`/dashboard/users/${user.id}`}
                          className="block w-full py-2 -my-2"
                        >
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.isActive
                                ? "text-green-800  dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >
                            {user.isActive ? "Yes" : "No"}
                          </span>
                        </Link>
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                        <div className="flex justify-center space-x-2 sm:space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(user.id);
                            }}
                            disabled={user.source === "Jira"}
                            className={`p-1.5 sm:p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors duration-200 shadow-sm hover:shadow-md ${
                              user.source === "Jira"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            title={
                              user.source === "Jira"
                                ? "Edit disabled for Jira users"
                                : "Edit User"
                            }
                          >
                            <Pencil size={16} className="sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(user.id);
                            }}
                            disabled={user.source === "Jira"}
                            className={`p-1.5 sm:p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                              user.source === "Jira"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            title={
                              user.source === "Jira"
                                ? "Delete disabled for Jira users"
                                : "Delete User"
                            }
                          >
                            <Trash2 size={16} className="sm:w-4 sm:h-4" />
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
        currentPage={filter.PageNumber ?? 1}
        rowsPerPage={filter.PageSize ?? 15}
        totalItems={totalCount}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl mx-4 sm:mx-auto p-4 animate-fadeInUp">
            <AddUser
              id={editingId}
              onClose={() => {
                setModalOpen(false);
                setEditingId(undefined);
              }}
              onUpdate={handleUpdate}
              onCreate={handleUpdate}
              roles={roles}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg max-w-sm w-full mx-4 text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm sm:text-base"
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

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default UserList;
