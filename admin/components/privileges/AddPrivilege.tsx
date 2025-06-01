"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { FormProject, Project } from "@/types";

interface Props {
  onClose: () => void;
  onCreate: (project: FormProject) => void;
  project?: Project;
}

const AddProject: React.FC<Props> = ({ onClose, onCreate, project }) => {
  const isEdit = Boolean(project);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="bg-white dark:bg-gray-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8 space-y-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-20 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {isEdit ? "Edit Project" : "Add Project"}
          </h2>
          <X
            onClick={onClose}
            size={24}
            className="text-gray-400 hover:text-red-500 cursor-pointer transition"
            aria-label="Close modal"
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            { name: "title", label: "Project Title", required: true },
            { name: "manager", label: "Project Manager", required: true },
            { name: "owner", label: "Project Owner", required: true },
            { name: "teamLeader", label: "Team Leader", required: false },
            {
              name: "developersInput",
              label: "Developers (comma-separated)",
              required: true,
            },
          ].map(({ name, label, required }) => (
            <div
              key={name}
              className={name === "developersInput" ? "md:col-span-2" : ""}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                name={name}
                value={(formData as any)[name]}
                onChange={handleChange}
                placeholder={label}
                className={`w-full rounded-md border px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors[name]
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors[name] && (
                <p className="text-red-600 mt-1 text-sm">{errors[name]}</p>
              )}
            </div>
          ))}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full rounded-md border px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                errors.status
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
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

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={`w-full rounded-md border px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                errors.priority
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
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

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Project description"
              className="w-full min-h-[120px] rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </form>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {isEdit ? "Update Project" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
