"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import { UserData, UserForm } from "@/types/user";
import { getUsers, deleteUser } from "@/utils/userApi";
import AddUser from "./AddUser";

const UserList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setModalOpen(true);
  };

  const handleUpdate = () => {
    loadUsers();
  };

  const handleCreate = (data: UserForm) => {
    loadUsers();
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete user");
    }
    loadUsers();
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        User List
      </h2>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {["Name", "Email", "Active", "Actions"].map((header) => (
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
                  colSpan={4}
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-300"
                >
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
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
                  {/* Name + Avatar */}
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
                      <span>{user.displayName || "—"}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {user.email}
                  </td>

                  {/* Active */}
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {user.active ? "Yes" : "No"}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(user.userId)}
                        aria-label={`Edit user ${user.displayName}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-white transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.userId)}
                        aria-label={`Delete user ${user.displayName}`}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <AddUser
            userId={editingId}
            onClose={() => {
              setModalOpen(false);
              setEditingId(undefined);
            }}
            onUpdate={handleUpdate}
            onCreate={handleCreate}
          />
        </div>
      )}
    </div>
  );
};

export default UserList;
