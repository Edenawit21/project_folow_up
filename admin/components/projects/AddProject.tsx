"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectForm {
  name: string;
  description: string;
  manager: string;
  owner: string;
  status: string;
  priority: string;
}

interface AddProjectProps {
  onCreate: (data: ProjectForm) => void;
  onClose?: () => void;
}

const mockManagers = ["Alice Johnson", "Bob Smith", "Charlie Lee"];

export default function AddProject({ onCreate }: AddProjectProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<ProjectForm>({
    name: "",
    description: "",
    manager: "",
    owner: "",
    status: "todo",
    priority: "Medium",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      className="p-8 space-y-6 bg-white border border-gray-200 rounded-2xl shadow-lg dark:bg-gray-900 dark:border-gray-700 max-w-2xl mt-10 ml-52"
    >
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        Add New Project
      </h2>

      <div className="space-y-5">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Project Name
          </label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter project name"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Project description"
          />
        </div>

        {/* Project Manager */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Project Manager
          </label>
          <select
            name="manager"
            value={formData.manager}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select a manager</option>
            {mockManagers.map((manager) => (
              <option key={manager} value={manager}>
                {manager}
              </option>
            ))}
          </select>
        </div>

        {/* Project Owner */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Project Owner
          </label>
          <input
            name="owner"
            type="text"
            value={formData.owner}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter owner name"
          />
        </div>

        {/* Status & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="todo">To Do</option>
              <option value="on_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="w-full sm:w-1/2 px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-1/2 px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition"
        >
          Create Project
        </button>
      </div>
    </form>
  );
}
