"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { getUsers, deleteUser } from "@/utils/userApi";



const UserList = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getUsers();
        console.log(response.data);
        setUsers(response.data);
      } catch (error: any) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId: string) => {
    router.push(`/users/add_user?id=${userId}`);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
      toast.success("User deleted successfully");
    } catch (error: any) {}
  };

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        User List
      </h2>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-600 dark:text-gray-300">
                First Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-600 dark:text-gray-300">
                Last Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-600 dark:text-gray-300">
                Account ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-600 dark:text-gray-300">
                Email
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-600 dark:text-gray-300">
                Display Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-600 dark:text-gray-300">
                Avatar
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-600 dark:text-gray-300">
                Active
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-600 dark:text-gray-300">
                Source
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium uppercase text-gray-600 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center px-4 py-8 text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center px-4 py-8 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.userId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {user.firstName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {user.accountId || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {user.displayName || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt="Avatar"
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {user.active ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {user.source || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => handleEdit(user.userId)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label={`Edit user ${user.firstName} ${user.lastName}`}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.userId)}
                        className="text-red-600 hover:text-red-800"
                        aria-label={`Delete user ${user.firstName} ${user.lastName}`}
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
    </div>
  );
};

export default UserList;
