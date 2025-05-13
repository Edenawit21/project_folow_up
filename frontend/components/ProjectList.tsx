"use client";
import React, { useState } from "react";
import { Project, Priority, Status } from "@/types";
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

  // Filter projects based on search term and filters
  const filteredProjects = projects.filter((project) => {
    return (
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.priority ? project.priority === filters.priority : true) &&
      (filters.status ? project.status === filters.status : true) &&
      (filters.team ? project.team === filters.team : true)
    );
  });

  // Group projects by their status
  const groupedProjects: Record<string, Project[]> = filteredProjects.reduce(
    (acc, project) => {
      const status = project.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(project);
      return acc;
    },
    {} as Record<string, Project[]>
  );

  // Function to handle clicking a project to view its details
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
        <div className="rounded-xl shadow-lg p-6 dark:bg-gray-900 mb-6 dark:text-white">
          <button
            onClick={handleBackToList}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4 flex items-center gap-2 cursor-pointer"
          >
            <span className="text-2xl dark:text-white">←</span>
          </button>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedProject.name}
            </h2>

            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th className="text-left p-2">Label</th>
                  <th className="text-left p-2">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-2 font-semibold">Description</td>
                  <td className="p-2">{selectedProject.description}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-2 font-semibold">Start Date</td>
                  <td className="p-2">{selectedProject.startDate}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-2 font-semibold">End Date</td>
                  <td className="p-2">{selectedProject.endDate}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-2 font-semibold">Priority</td>
                  <td className="p-2">{selectedProject.priority}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-2 font-semibold">Status</td>
                  <td className="p-2">{selectedProject.status}</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-2 font-semibold">Team</td>
                  <td className="p-2">{selectedProject.team}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex gap-4 border-t pt-4 border-gray-200 dark:border-gray-700">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Edit fontSize="small" />
              </button>

              <button
                onClick={handleDeleteAndClose}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
              >
                <Delete fontSize="small" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedProjects).map(([status, items]) => {
            // Normalize status to human-readable format
            const formattedStatus = status.replace(/([A-Z])/g, " $1").trim();
            return (
              <div
                key={status}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {formattedStatus} ({items.length})
                </h2>

                <div className="space-y-3">
                  {items.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => handleProjectClick(project)}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white truncate">
                          {project.name}
                        </span>
                      </div>
                    </div>
                  ))}

                  {items.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-3 text-sm">
                      No projects in this group
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
