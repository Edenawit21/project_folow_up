"use client";

import React, { useState } from "react";
import { FormProject } from "@/types";

interface CreateProjectModalProps {
  onClose: () => void;
  onCreate: (project: FormProject) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState<FormProject>({
    title: "",
    description: "",
    priority: "High",
    status: "todo",
    developers: "",
    manager: "",
    owner: "",
    teamLeader: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onCreate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>

        <div className="grid gap-4">
          <input
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="manager"
            placeholder="Project Manager"
            value={formData.manager}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="teamLeader"
            placeholder="Team Leader"
            value={formData.teamLeader}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="owner"
            placeholder="Project Owner"
            value={formData.owner}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="developers"
            placeholder="Developers"
            value={formData.developers}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="todo">Todo</option>
            <option value="on_progress">On Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
