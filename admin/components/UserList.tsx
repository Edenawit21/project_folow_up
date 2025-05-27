"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  userName: string;
  email: string;
}

interface UserListProps {
  role: "Director" | "ProjectManager" | "ProjectOwner" | "TeamLeader";
  token: string; // JWT token for auth
}

const UserList: React.FC<UserListProps> = ({ role, token }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await axios.get<User[]>(`${apiBaseUrl}/api/${role}`, {
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
  }, [role, token]);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users with role: {role}</h2>
      {users.length === 0 && <p>No users found.</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.userName} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
