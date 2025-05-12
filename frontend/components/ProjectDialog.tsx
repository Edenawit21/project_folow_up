import React from "react";
import { Project } from "@/types";

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
  const formattedDate =
    typeof formData.dueDate === "string"
      ? formData.dueDate
      : new Date(formData.dueDate).toISOString().split("T")[0];

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
    >
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-8">
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
              className="w-full px-4 py-2 border rounded-lg"
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
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Due Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg"
              value={formattedDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dueDate: e.target.value,
                })
              }
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Priority</label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as "High" | "Medium" | "Low",
                })
              }
            >
              {["High", "Medium", "Low"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Status</label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as
                    | "Not Started"
                    | "In Progress"
                    | "Completed"
                    | "On Hold",
                })
              }
            >
              {["Not Started", "In Progress", "Completed", "On Hold"].map(
                (option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Team</label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
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
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
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
