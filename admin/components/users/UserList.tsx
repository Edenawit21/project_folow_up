"use client";

import React, { useState } from "react";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "react-toastify";

interface User {
  id: string;
  userName: string;
  email: string;
  roles: string[];
}

interface UserListProps {
  token?: string; // token is unused for now
}

const initialUsers: User[] = [
  {
    id: "1",
    userName: "john_doe",
    email: "john@example.com",
    roles: ["Admin", "ProjectManager"],
  },
  {
    id: "2",
    userName: "jane_smith",
    email: "jane@example.com",
    roles: ["TeamLeader"],
  },
  {
    id: "3",
    userName: "bob_jones",
    email: "bob@example.com",
    roles: ["Director", "Admin"],
  },
];

const UserList: React.FC<UserListProps> = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Allow roles as string (editable) for editData
  const [editData, setEditData] = useState<Partial<User> & { roles?: string }>(
    {}
  );

  const startEdit = (user: User) => {
    setEditingUserId(user.id);
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditData({});
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof User
  ) => {
    setEditData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const saveEdit = () => {
    if (!editingUserId) return;

    const rolesArray =
      typeof editData.roles === "string"
        ? editData.roles
            .split(",")
            .map((r) => r.trim())
            .filter((r) => r.length > 0)
        : [];

    setUsers((prev) =>
      prev.map((user) =>
        user.id === editingUserId
          ? {
              ...user,
              userName: editData.userName || user.userName,
              email: editData.email || user.email,
              roles: rolesArray,
            }
          : user
      )
    );

    toast.success("User updated successfully!");
    cancelEdit();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setUsers((prev) => prev.filter((user) => user.id !== id));
    toast.success("User deleted successfully");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          All Users and Roles
        </h2>

        {users.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No users found.
          </p>
        ) : (
          <div className="overflow-auto rounded shadow border border-gray-300 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Roles
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4">
                      {editingUserId === user.id ? (
                        <input
                          type="text"
                          value={editData.userName || ""}
                          onChange={(e) => handleEditChange(e, "userName")}
                          className="border px-2 py-1 w-full rounded"
                        />
                      ) : (
                        user.userName
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingUserId === user.id ? (
                        <input
                          type="email"
                          value={editData.email || ""}
                          onChange={(e) => handleEditChange(e, "email")}
                          className="border px-2 py-1 w-full rounded"
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingUserId === user.id ? (
                        <input
                          type="text"
                          value={
                            typeof editData.roles === "string"
                              ? editData.roles
                              : ""
                          }
                          onChange={(e) => handleEditChange(e, "roles")}
                          className="border px-2 py-1 w-full rounded"
                          placeholder="Comma separated roles"
                        />
                      ) : (
                        user.roles.join(", ")
                      )}
                    </td>
                    <td className="px-6 py-4 space-x-2 flex items-center">
                      {editingUserId === user.id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-800"
                            aria-label="Save"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Cancel"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(user)}
                            className="text-blue-600 hover:text-blue-800"
                            aria-label="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-800"
                            aria-label="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
