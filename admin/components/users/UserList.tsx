"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import { User } from "@/types";
import { userService } from "@/utils/userApi";
import { useRouter } from "next/navigation";

interface UserListProps {
  token?: string;
}

const UserList: React.FC<UserListProps> = ({ token }) => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await userService.getUsers({ token });
        setUsers(data);
      } catch {
        toast.error("Error loading users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleEdit = (user: User) => {
    router.push(`/users/add_user?id=${user.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await userService.deleteUser(id, { token });
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted.");
    } catch {
      toast.error("Failed to delete user.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
          User Management
        </h2>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {["Username", "Roles", "Actions"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center px-6 py-8 text-gray-500 dark:text-gray-400"
                >
                  Loading users...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.Username}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                    {user.roles.join(", ")}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label={`Edit user ${user.Username}`}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800"
                        aria-label={`Delete user ${user.Username}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
