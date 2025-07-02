"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Trash2, Pencil, Plus, Search, X, Filter } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

import { UserData, UserFilterDto } from "@/types/user";
import { RoleData } from "@/types/role";
import { getUsers, deleteUser } from "@/utils/userApi";
import { fetchAllRoles } from "@/utils/roleApi";
import AddUser from "./AddUser";
import PaginationFooter from "@/components/footer/PaginationFooter";

const Select = ({
  value,
  onValueChange,
  options,
  placeholder,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
}) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
      <Filter size={16} />
    </div>
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
      aria-label={placeholder}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const UserList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const [filter, setFilter] = useState<UserFilterDto>({
    PageNumber: 1,
    PageSize: 10,
    SortBy: "Name",
    SortDescending: false,
  });
  const [totalCount, setTotalCount] = useState(0);

  // Fetch users and roles according to current filters
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const apiFilter = {
        ...filter,
        SearchTerm: searchTerm || undefined,
        Role: roleFilter || undefined,
        Source: sourceFilter || undefined,
      };

      const [usersResult, rolesResponse] = await Promise.all([
        getUsers(apiFilter),
        fetchAllRoles(),
      ]);

      const { items, totalCount } = usersResult;
      setUsers(items);
      setTotalCount(totalCount);
      setRoles(rolesResponse);
    } catch (error) {
      toast.error("Failed to fetch users or roles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm, roleFilter, sourceFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers for search & filters
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilter((prev) => ({ ...prev, PageNumber: 1 }));
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilter((prev) => ({ ...prev, SearchTerm: undefined, PageNumber: 1 }));
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setFilter((prev) => ({ ...prev, Role: value || undefined, PageNumber: 1 }));
  };

  const handleSourceFilterChange = (value: string) => {
    setSourceFilter(value);
    setFilter((prev) => ({
      ...prev,
      Source: value || undefined,
      PageNumber: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, PageNumber: page }));
  };

  const handleRowsPerPageChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, PageSize: pageSize, PageNumber: 1 }));
  };

  const handleCreate = () => {
    setEditingId(undefined);
    setModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingId(undefined);
  };

  const handleModalUpdate = () => {
    // Refresh user list after add/update
    fetchData();
    handleModalClose();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser(deleteId);
      toast.success("User deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete user");
      console.error(error);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Users Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">
            Manage and organize users in the system.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 group w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4 md:justify-between">
        <div className="relative w-full sm:max-w-md md:flex-grow-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search users..."
            className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
          <div className="w-full md:w-56">
            <Select
              value={sourceFilter}
              onValueChange={handleSourceFilterChange}
              placeholder="Source"
              options={[
                { value: "Jira", label: "Jira" },
                { value: "Local", label: "Local" },
              ]}
            />
          </div>

          <div className="w-full md:w-56">
            <Select
              value={roleFilter}
              onValueChange={handleRoleFilterChange}
              placeholder="Role"
              options={roles.map((role) => ({
                value: role.name,
                label: role.name,
              }))}
            />
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-4 text-left text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-4 text-left text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-4 py-4 text-left text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-4 py-4 text-left text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
                  Active
                </th>
                <th className="px-4 py-4 text-left text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    <div className="animate-spin h-6 w-6 border-2 border-indigo-500 rounded-full border-t-transparent mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Loading users...
                    </p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-12 h-12 sm:w-16 sm:h-16" />
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                        {searchTerm
                          ? "No matching users found"
                          : "No users found"}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                        {searchTerm
                          ? "Try adjusting your search query"
                          : "Get started by creating a new user"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
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
        rowsPerPage={filter.PageSize ?? 10}
        totalItems={totalCount}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4 max-w-2xl w-full mx-4">
            <AddUser
              id={editingId}
              onClose={handleModalClose}
              onCreate={handleModalUpdate}
              onUpdate={handleModalUpdate}
              roles={roles}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 text-center">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
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
