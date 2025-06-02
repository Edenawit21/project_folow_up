"use client";

import { useState } from "react";
import { Project } from "@/types";
import { useRouter } from "next/navigation";

interface AddProjectProps {
  onCreate: (data: Project) => void;
  onClose: () => void;
}

export default function AddProject({ onCreate }: AddProjectProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<Project>({
    projectKey: "",
    projectName: "",
    projectManager: "",
    totalIssues: 0,
    issuesDone: 0,
    issuesInProgress: 0,
    totalStoryPoint: 0,
    storyPointsDone: 0,
    riskLevel: "",
    lastSyncedAt: "",
    title: "",
    description: "",
    manager: "",
    owner: "",
    teamLeader: "",
    developers: [],
    status: "todo",
    priority: "Medium",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "developers"
          ? value.split(",").map((dev) => dev.trim())
          : name in prev && typeof prev[name as keyof Project] === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-6 bg-white border rounded-xl shadow-md dark:bg-gray-900 dark:border-gray-700 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Add New Project
      </h2>

      {/* Project Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "projectKey", label: "Project Key" },
          { name: "projectName", label: "Project Name" },
          { name: "title", label: "Title" },
          { name: "description", label: "Description" },
          { name: "projectManager", label: "Project Manager" },
          { name: "manager", label: "Manager" },
          { name: "owner", label: "Owner" },
          { name: "teamLeader", label: "Team Leader" },
          { name: "riskLevel", label: "Risk Level" },
          { name: "lastSyncedAt", label: "Last Synced At" },
        ].map(({ name, label }) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              {label}
            </label>
            <input
              name={name}
              type="text"
              value={(formData as any)[name]}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder={label}
            />
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: "totalIssues", label: "Total Issues" },
          { name: "issuesDone", label: "Issues Done" },
          { name: "issuesInProgress", label: "Issues In Progress" },
          { name: "totalStoryPoint", label: "Total Story Points" },
          { name: "storyPointsDone", label: "Story Points Done" },
        ].map(({ name, label }) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">
              {label}
            </label>
            <input
              name={name}
              type="number"
              value={(formData as any)[name]}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder={label}
            />
          </div>
        ))}
      </div>

      {/* Developers */}
      <div>
        <label className="block text-sm font-medium mb-1 dark:text-gray-300">
          Developers (comma-separated)
        </label>
        <input
          name="developers"
          type="text"
          value={formData.developers?.join(", ") || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder="e.g., Alice, Bob"
        />
      </div>

      {/* Status and Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="todo">To Do</option>
            <option value="on_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="w-1/2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-1/2 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
        >
          Create Project
        </button>
      </div>
    </form>
  );
}
