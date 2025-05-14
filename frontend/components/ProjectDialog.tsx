import React from "react";
import { Project, Priority, Status } from "@/types";

interface ProjectDialogProps {
  formData: Omit<Project, "id">;
  setFormData: (formData: Omit<Project, "id">) => void;
  handleSubmit: () => void;
  handleCloseDialog: () => void;
  editingProject: Project | null;
  teams: string[];
}

const ProjectDialog = ({
  formData,
  setFormData,
  handleSubmit,
  handleCloseDialog,
  editingProject,
  teams,
}: ProjectDialogProps) => {
  // Check if startDate is defined before formatting
  const formattedDate =
    formData.startDate && typeof formData.startDate === "string"
      ? formData.startDate
      : formData.startDate
      ? new Date(formData.startDate).toISOString().split("T")[0]
      : ""; // Empty string if startDate is undefined or null

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
    >
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-xl p-8 text-gray-900 dark:text-gray-100">
        <h2 className="text-2xl font-bold mb-6">
          {editingProject ? "Edit Project" : "Create New Project"}
        </h2>
        <form
          onSubmit={onFormSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="col-span-2">
            <input
              type="text"
              placeholder="Project Name"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="col-span-2">
            <textarea
              placeholder="Description"
              rows={3}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Start Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              value={formattedDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  startDate: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Priority</label>
            <select
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as Priority,
                })
              }
            >
              {Object.values(Priority).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Status</label>
            <select
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as Status,
                })
              }
            >
              {Object.values(Status).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Team</label>
            <select
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              value={formData.team}
              onChange={(e) =>
                setFormData({ ...formData, team: e.target.value })
              }
            >
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={handleCloseDialog}
              className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer"
            >
              {editingProject ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectDialog;
