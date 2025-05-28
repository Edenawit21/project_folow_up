"use client";

import React, { useState } from "react";

const AddTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // For now, just log values
    console.log("Team Name:", teamName);
    console.log("Description:", description);

    // TODO: Send to backend
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Register New Team
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="teamName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Team Name
          </label>
          <input
            id="teamName"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Optional"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Create Team
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTeam;
