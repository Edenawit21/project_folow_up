"use client";

import { useState } from "react";
import UserList from "@/components/UserList";
interface User {
  id: string;
  name: string;
  email: string;
  azureRole: string;
  jiraRole: string;
}

const sampleUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@company.com",
    azureRole: "Developer",
    jiraRole: "Project Manager",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@company.com",
    azureRole: "QA",
    jiraRole: "Tester",
  },
];

export default function Page() {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);

    // TODO: Replace this with real fetch from Jira and Azure APIs
    setTimeout(() => {
      setUsers(sampleUsers); // just reset sample for now
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className="mb-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Refreshing..." : "Refresh from Jira & Azure"}
      </button>
      <UserList users={users} />
    </>
  );
}
