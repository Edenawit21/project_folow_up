"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  userName: string;
  email: string;
  Role?: string;
}

interface UserListProps {
  Role: "Director" | "ProjectManager" | "ProjectOwner" | "TeamLeader";
  token: string;
}

const UserList: React.FC<UserListProps> = ({ Role, token }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await axios.get<User[]>(`${apiBaseUrl}/api/${Role}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err: any) {
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [Role, token]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Users with Role: {Role}
        </h2>

        {loading && <p className="text-center">Loading users...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <>
            {users.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No users found.
              </p>
            ) : (
              <div className="overflow-auto rounded-xl shadow-lg border border-gray-300 dark:border-gray-700">
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
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4">{user.userName}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.Role ?? Role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserList;
