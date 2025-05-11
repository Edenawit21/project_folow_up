import React, { useState } from "react";
import { Project } from "@/types";
import { Edit, Delete } from "@mui/icons-material";

interface ProjectListProps {
  projects: Project[];
  searchTerm: string;
  filters: {
    priority: string;
    status: string;
    team: string;
  };
  setEditingProject: (project: Project) => void;
  setOpenDialog: (open: boolean) => void;
  handleDelete: (projectId: number) => void;
}

const ProjectList = ({
  projects,
  searchTerm,
  filters,
  setEditingProject,
  setOpenDialog,
  handleDelete,
}: ProjectListProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((project) => {
    return (
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.priority ? project.priority === filters.priority : true) &&
      (filters.status ? project.status === filters.status : true) &&
      (filters.team ? project.team === filters.team : true)
    );
  });

  const groupedProjects = {
    Active: filteredProjects.filter(
      (p) => p.status === "In Progress" || p.status === "Not Started"
    ),
    Pending: filteredProjects.filter((p) => p.status === "On Hold"),
    Completed: filteredProjects.filter((p) => p.status === "Completed"),
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToList = () => {
    setSelectedProject(null);
  };

  const handleEdit = () => {
    if (selectedProject) {
      setEditingProject(selectedProject);
      setOpenDialog(true);
    }
  };

  const handleDeleteAndClose = () => {
    if (selectedProject) {
      handleDelete(selectedProject.id);
      setSelectedProject(null);
    }
  };

  return (
    <div className="p-4">
      {selectedProject ? (
        <div className="rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
          <button
            onClick={handleBackToList}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            <span className="text-2xl">←</span>
            <span className="font-medium">Back to Groups</span>
          </button>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedProject.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Description:</span>
                  <br />
                  <span className="text-gray-600">
                    {selectedProject.description || "No description"}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <DetailItem
                  label="Due Date"
                  value={new Date(selectedProject.dueDate).toLocaleDateString()}
                />
                <DetailItem label="Priority" value={selectedProject.priority} />
                <DetailItem label="Status" value={selectedProject.status} />
                <DetailItem label="Team" value={selectedProject.team} />
              </div>
            </div>

            <div className="flex gap-4 border-t pt-4">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit fontSize="small" />
                Edit Project
              </button>

              <button
                onClick={handleDeleteAndClose}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Delete fontSize="small" />
                Delete Project
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(groupedProjects).map(([status, items]) => (
            <div
              key={status}
              className="bg-white rounded-xl shadow-lg p-4 border border-gray-100"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {status} ({items.length})
              </h2>

              <div className="space-y-3">
                {items.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    className="p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 truncate">
                        {project.name}
                      </span>
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="text-center text-gray-500 py-3 text-sm">
                    No projects in this group
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2">
    <span className="font-semibold text-gray-700">{label}:</span>
    <span className="text-gray-600">{value}</span>
  </div>
);

export default ProjectList;
