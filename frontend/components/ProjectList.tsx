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
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(
    null
  );

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

  const toggleExpand = (id: number) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(groupedProjects).map(([status, items]) => (
        <div key={status} className="flex-1">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {status} ({items.length})
          </h2>
          <div className="space-y-4">
            {items.map((project) => (
              <div
                key={project.id}
                className="bg-white shadow rounded-lg p-4 cursor-pointer"
                onClick={() => toggleExpand(project.id)}
              >
                <h3 className="font-semibold text-lg">{project.name}</h3>

                {expandedProjectId === project.id && (
                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <p>
                      <strong>Description:</strong> {project.description}
                    </p>
                    <p>
                      <strong>Due:</strong>{" "}
                      {new Date(project.dueDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Priority:</strong> {project.priority}
                    </p>
                    <p>
                      <strong>Status:</strong> {project.status}
                    </p>
                    <p>
                      <strong>Team:</strong> {project.team}
                    </p>
                    <div className="flex gap-4 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProject(project);
                          setOpenDialog(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit fontSize="small" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Delete fontSize="small" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
