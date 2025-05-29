"use client";

import { useEffect, useState } from "react";
import { FormProject, Project } from "@/types";

interface Props {
  onClose: () => void;
  onCreate: (project: FormProject) => void;
  project?: Project;
}

const CreateProjectModal: React.FC<Props> = ({ onClose, onCreate, project }) => {
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
      developers: formData.developersInput.trim(),
    };

    onCreate(transformed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-lime-50 dark:bg-[var(--background)] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center sticky top-0 bg-lime-50 dark:bg-[var(--background)] z-10 pb-2">
          <h2 className="text-xl font-semibold text-[var(--text)]">
            {isEdit ? "Edit Project" : "Create Project"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 text-sm">
            ✕
          </button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[var(--muted)] mb-1">Project Title *</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Project title"
              className="w-full px-3 py-2 rounded border border-[var(--border)] bg-transparent text-[var(--text)]"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm text-[var(--muted)] mb-1">Project Manager *</label>
            <input
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              placeholder="Manager name"
              className="w-full px-3 py-2 rounded border border-[var(--border)] bg-transparent text-[var(--text)]"
            />
            {errors.manager && <p className="text-red-500 text-sm mt-1">{errors.manager}</p>}
          </div>

          <div>
            <label className="block text-sm text-[var(--muted)] mb-1">Project Owner *</label>
            <input
              name="owner"
              value={formData.owner}
              onChange={handleChange}
              placeholder="Owner name"
              className="w-full px-3 py-2 rounded border border-[var(--border)] bg-transparent text-[var(--text)]"
            />
            {errors.owner && <p className="text-red-500 text-sm mt-1">{errors.owner}</p>}
          </div>

          <div>
            <label className="block text-sm text-[var(--muted)] mb-1">Team Leader</label>
            <input
              name="teamLeader"
              value={formData.teamLeader}
              onChange={handleChange}
              placeholder="Team leader name"
              className="w-full px-3 py-2 rounded border border-[var(--border)] bg-transparent text-[var(--text)]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-[var(--muted)] mb-1">Developers *</label>
            <input
              name="developersInput"
              value={formData.developersInput}
              onChange={handleChange}
              placeholder="Comma-separated names"
              className="w-full px-3 py-2 rounded border border-[var(--border)] bg-transparent text-[var(--text)]"
            />
          </div>

          <div>
            <label className="block text-sm text-[var(--muted)] mb-1">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-[var(--border)] bg-transparent text-[var(--text)]"
            >
              <option value="">Select status</option>
              <option value="todo">Todo</option>
              <option value="on_progress">On Progress</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
          </div>

          <div>
            <label className="block text-sm text-[var(--muted)] mb-1">Priority *</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-[var(--border)] bg-transparent text-[var(--text)]"
            >
              <option value="">Select priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm text-[var(--muted)] mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the project"
            className="w-full px-3 py-2 rounded border border-[var(--border)] bg-transparent text-[var(--text)]"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-lime-50 dark:bg-[var(--background)] pb-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-[var(--border)] text-[var(--text)] hover:bg-gray-100 dark:hover:bg-[var(--hover)] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            {isEdit ? "Update Project" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
