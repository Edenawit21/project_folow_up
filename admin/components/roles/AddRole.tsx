"use client";

import React, { useState } from "react";

const AddRole = () => {
  const [roleName, setRoleName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      setMessage("Role name is required.");
      return;
    }

    // Simulate submission (replace with actual API call)
    console.log("Role submitted:", roleName);
    setMessage(`Role "${roleName}" created successfully.`);
    setRoleName("");
  };

  return (
    <div className="w-[500px] ml-64 mt-10 p-6 bg-white dark:bg-gray-900 shadow-sm rounded-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Add Role
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="roleName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Role Name
          </label>
          <input
            id="roleName"
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="e.g. Admin, Manager, Developer"
            className="mt-1 block w-full px-4 py-2 border rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
        >
          Create Role
        </button>

        {message && (
          <p className="text-sm mt-2 text-green-600 dark:text-green-400">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddRole;
