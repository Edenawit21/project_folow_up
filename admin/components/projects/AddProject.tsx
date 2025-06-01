"use client";

import { useState } from "react";
import { Project } from "@/types";

interface AddProjectProps {
  onCreate: (data: Project) => void;
  onClose: () => void;
}

export default function AddProject({ onCreate, onClose }: AddProjectProps) {
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

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded shadow-md space-y-4 bg-white max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold">Add Project</h2>

      {[
        "projectKey",
        "projectName",
        "projectManager",
        "riskLevel",
        "lastSyncedAt",
        "title",
        "description",
        "manager",
        "owner",
        "teamLeader",
      ].map((field) => (
        <input
          key={field}
          name={field}
          type="text"
          placeholder={field}
          value={(formData as any)[field]}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      ))}

      {[
        "totalIssues",
        "issuesDone",
        "issuesInProgress",
        "totalStoryPoint",
        "storyPointsDone",
      ].map((field) => (
        <input
          key={field}
          name={field}
          type="number"
          placeholder={field}
          value={(formData as any)[field]}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      ))}

      <input
        name="developers"
        type="text"
        placeholder="Developers (comma-separated)"
        value={formData.developers?.join(", ") || ""}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="todo">To Do</option>
        <option value="on_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Project
        </button>
      </div>
    </form>
  );
}
