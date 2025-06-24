"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Trash2, Pencil, Plus, Search, X } from "lucide-react";
import { toast } from "react-toastify";
import { UserData } from "@/types/user";
import { getUsers, deleteUser } from "@/utils/userApi";
import { fetchAllRoles } from "@/utils/roleApi";
import AddUser from "./AddUser";
import { RoleData } from "@/types/role";
import PaginationFooter from "@/components/footer/PaginationFooter";
import Link from "next/link";

const UserList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          getUsers(),
          fetchAllRoles(),
        ]);
        setUsers(usersResponse);
        setRoles(rolesResponse);
      } catch (error) {
        toast.error("Failed to fetch users or roles");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        (user.displayName || `${user.firstName} ${user.lastName}`)
          .toLowerCase()
          .includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.roles &&
          user.roles.some((role) => role.toLowerCase().includes(query))) ||
        user.source.toLowerCase().includes(query) ||
        (user.isActive ? "yes" : "no").includes(query)
    );
  }, [users, searchQuery]);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingId(undefined);
    setModalOpen(true);
  };

  const handleUpdate = () => {
    loadUsers();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser(deleteId);
      toast.success("User deleted successfully");
      loadUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setDeleteId(null);
    }
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate users to display for current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-indigo-500 dark:text-white">
            Users Management
          </h2>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300 focus:ring-2 rounded-[6px]"
          >
            <Plus size={18} />
            Create User
          </button>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-300 italic text-sm">
          Manage and organize users in the system.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="block w-full pl-10 pr-10 py-2.5 text-base rounded-lg border border-gray-300 dark:border-gray-600  dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase text-xs font-semibold sticky top-0 z-10">
            <tr>
              {["Name", "Email", "Roles", "Source", "Active", "Actions"].map(
                (header) => (
                  <th key={header} className="px-4 py-3 whitespace-nowrap">
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
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-300"
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 mr-2"></div>
                    Loading users...
                  </div>
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                      {searchQuery
                        ? "No matching users found"
                        : "No users found"}
                    </h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                      {searchQuery
                        ? "Try adjusting your search query"
                        : "Get started by creating a new user"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200 whitespace-nowrap cursor-pointer">
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="block w-full py-3 -my-3"
                    >
                      {user.displayName || `${user.firstName} ${user.lastName}`}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200 whitespace-nowrap cursor-pointer">
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="block w-full py-3 -my-3"
                    >
                      {user.email}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-green-500 whitespace-nowrap text-base dark:text-green-500 cursor-pointer">
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="block w-full py-3 -my-3"
                    >
                      {user.roles?.join(", ")}
                    </Link>
                  </td>
                  <td className="px-4 py-3 dark:text-sky-500 whitespace-nowrap text-sky-600 cursor-pointer">
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="block w-full py-3 -my-3"
                    >
                      {user.source}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200 whitespace-nowrap cursor-pointer">
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="block w-full py-3 -my-3"
                    >
                      {user.isActive ? "Yes" : "No"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(user.id);
                        }}
                        disabled={user.source === "Jira"}
                        className={`text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-white ${
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
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(user.id);
                        }}
                        disabled={user.source === "Jira"}
                        className={`text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 ${
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
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaginationFooter
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalItems={filteredUsers.length}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(1);
        }}
      />

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl mx-auto p-4 animate-fadeInUp">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone
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

export default UserList;
