"use client";

import { useEffect, useState } from "react";
import { FormProject, Project } from "@/types";

interface Props {
  onClose: () => void;
  onCreate: (project: FormProject) => void;
  project?: Project;
}

const CreateProjectModal: React.FC<Props> = ({ onClose, onCreate, project }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "High",
    status: "todo",
    developersInput: "",
    manager: "",
    owner: "",
    teamLeader: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        priority: project.priority || "High",
        status: project.status || "todo",
        developersInput: Array.isArray(project.developers)
          ? project.developers.join(", ")
          : "",
        manager: project.manager || "",
        owner: project.owner || "",
        teamLeader: project.teamLeader || "",
      });
    }
  }, [project]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.manager.trim()) newErrors.manager = "Manager is required";
    if (!formData.owner.trim()) newErrors.owner = "Owner is required";
    if (!formData.priority.trim()) newErrors.priority = "Priority is required";
    if (!formData.status.trim()) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const transformed: FormProject = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority as "High" | "Medium" | "Low",
      status: formData.status as "todo" | "on_progress" | "completed",
      manager: formData.manager,
      owner: formData.owner,
      teamLeader: formData.teamLeader,
      developers: formData.developersInput.trim(), // <-- This must be a string as per FormProject
    };

    onCreate(transformed);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {project ? "Edit Project" : "Create Project"}
        </h2>

        <div className="grid gap-4">
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <input
            name="manager"
            placeholder="Manager"
            value={formData.manager}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.manager && <p className="text-red-500 text-sm">{errors.manager}</p>}

          <input
            name="owner"
            placeholder="Owner"
            value={formData.owner}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.owner && <p className="text-red-500 text-sm">{errors.owner}</p>}

          <input
            name="teamLeader"
            placeholder="Team Leader"
            value={formData.teamLeader}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <input
            name="developersInput"
            placeholder="Developers (comma-separated)"
            value={formData.developersInput}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select status</option>
            <option value="todo">Todo</option>
            <option value="on_progress">On Progress</option>
            <option value="completed">Completed</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          {errors.priority && <p className="text-red-500 text-sm">{errors.priority}</p>}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {project ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
