"use client";

interface User {
  id: string;
  name: string;
  email: string;
  azureRole: string;
  jiraRole: string;
}

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  if (users.length === 0) {
    return <p className="text-gray-500">No users available.</p>;
  }

  return (
    <table className="min-w-full border border-gray-300 rounded bg-white">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border text-left">Name</th>
          <th className="p-2 border text-left">Email</th>
          <th className="p-2 border text-left">Azure Role</th>
          <th className="p-2 border text-left">Jira Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map(({ id, name, email, azureRole, jiraRole }) => (
          <tr key={id} className="even:bg-gray-50">
            <td className="p-2 border">{name}</td>
            <td className="p-2 border">{email}</td>
            <td className="p-2 border">{azureRole}</td>
            <td className="p-2 border">{jiraRole}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
