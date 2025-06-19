"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { UserData } from "@/types/user";
import { RoleData } from "@/types/role";
import { getUsers, deleteUser } from "@/utils/userApi";
import { fetchAllRoles } from "@/utils/roleApi";
import AddUser from "./AddUser";

const UserList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();

  useEffect(() => {
    loadUsers();
    loadRoles();
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

  const loadRoles = async () => {
    try {
      const roleData = await fetchAllRoles();
      setRoles(roleData);
    } catch (error) {
      toast.error("Failed to fetch roles");
    }
  };

  const getRoleNames = (roleIds: string[]) => {
    return roleIds
      .map((id) => roles.find((role) => role.roleId === id)?.name || "Unknown")
      .join(", ");
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

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
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
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md shadow"
        >
          <Plus size={16} />
          Create User
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {["Name", "Email", "Roles", "Active", "Actions"].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-white uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-300"
                >
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.userId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-200">
                          <span className="text-xs font-semibold">?</span>
                        </div>
                      )}
                      <span>
                        {user.firstName} {user.lastName || user.displayName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {getRoleNames(user.roles || [])}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {user.active ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(user.userId)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-white transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.userId)}
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
              userId={editingId}
              onClose={() => {
                setModalOpen(false);
                setEditingId(undefined);
              }}
              onUpdate={handleUpdate}
              onCreate={handleUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
