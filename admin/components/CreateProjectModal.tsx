"use client";

import { useEffect, useState } from "react";
import { FormProject, Project } from "@/types";

interface Props {
  onClose: () => void;
  onCreate: (project: FormProject) => void;
  project?: Project;
}

const CreateProjectModal: React.FC<Props> = ({
  onClose,
  onCreate,
  project,
}) => {
  const isEdit = !!project;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
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
        priority: project.priority || "",
        status: project.status || "",
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      developers: formData.developersInput.trim(),
    };

    onCreate(transformed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8 space-y-8 relative">
        {/* Header */}
        <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-20 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {isEdit ? "Edit Project" : "Create Project"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form Fields */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Each input wrapper */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Project title"
              className={`w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? "border-red-500" : ""
              }`}
            />
            {errors.title && (
              <p className="text-red-600 mt-1 text-sm">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Manager <span className="text-red-500">*</span>
            </label>
            <input
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              placeholder="Manager name"
              className={`w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.manager ? "border-red-500" : ""
              }`}
            />
            {errors.manager && (
              <p className="text-red-600 mt-1 text-sm">{errors.manager}</p>
            )}
          </div>

          {/* Repeat similarly for other inputs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Owner <span className="text-red-500">*</span>
            </label>
            <input
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              placeholder="Owner name"
              className={`w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.owner ? "border-red-500" : ""
              }`}
            />
            {errors.owner && (
              <p className="text-red-600 mt-1 text-sm">{errors.owner}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Team Leader
            </label>
            <input
              name="teamLeader"
              value={formData.teamLeader}
              onChange={handleChange}
              placeholder="Team leader name"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Developers <span className="text-red-500">*</span>
            </label>
            <input
              name="developersInput"
              value={formData.developersInput}
              onChange={handleChange}
              placeholder="Comma-separated names"
              className={`w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.developersInput ? "border-red-500" : ""
              }`}
            />
            {errors.developersInput && (
              <p className="text-red-600 mt-1 text-sm">
                {errors.developersInput}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.status ? "border-red-500" : ""
              }`}
            >
              <option value="">Select status</option>
              <option value="todo">Todo</option>
              <option value="on_progress">On Progress</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && (
              <p className="text-red-600 mt-1 text-sm">{errors.status}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.priority ? "border-red-500" : ""
              }`}
            >
              <option value="">Select priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            {errors.priority && (
              <p className="text-red-600 mt-1 text-sm">{errors.priority}</p>
            )}
          </div>
        </form>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the project"
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 py-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            {isEdit ? "Update Project" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
