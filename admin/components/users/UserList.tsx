"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { UserData } from "@/types/user";
import { getUsers, deleteUser } from "@/utils/userApi";
import { fetchAllRoles } from "@/utils/roleApi";
import AddUser from "./AddUser";
import { RoleData } from "@/types/role";

const UserList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();

  useEffect(() => {
    // Fetch both users and roles on mount
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      loadUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          User List
        </h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-[6px] shadow-md hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:outline-none"
        >
          <Plus size={16} />
          Create User
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {["Name", "Email", "Roles", "Source", "Active", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-white uppercase tracking-wider"
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
                  colSpan={9}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-300"
                >
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {user.displayName || `${user.firstName} ${user.lastName}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {user.roles?.join(", ")}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {user.source}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {user.isActive ? "Yes" : "No"}
                  </td>

                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-white transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors"
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
          <div className="transform animate-scaleIn">
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
    </div>
  );
};

export default UserList;
