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
  return (
    <div
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
    >
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6">
          {editingProject ? "Edit Project" : "Create New Project"}
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <input
              type="text"
              placeholder="Project Name"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
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
            />
          </div>
          <div>
            <label>Due Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg"
              value={new Date(formData.dueDate).toISOString().split("T")[0]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dueDate: new Date(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label>Priority</label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value as "High" | "Medium" | "Low" })
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
            <label>Status</label>
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as "Not Started" | "In Progress" | "Completed" | "On Hold" })
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
            <label>Team</label>
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
          <div className="col-span-2 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCloseDialog}
              className="px-5 py-2 rounded-lg bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white"
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
