"use client";

import { useState, useEffect, useMemo } from "react";
import { Project } from "@/types";
import ProjectFilter from "@/components/ProjectFilter";
import ProjectTable from "@/components/ProjectTable";
import { initialProjects } from "@/constants";
import CreateProjectModal from "@/components/CreateProjectModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState({
    riskLevel: "",
  });

  const [view, setView] = useState<"table" | "board" | "timeline" | "graph">("table");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  useEffect(() => {
    setProjects(initialProjects);
    console.log("Projects loaded:", initialProjects);
  }, []);

  const handleCreateOrUpdate = (data: any) => {
    if (editingProject) {
      setProjects((prev) =>
        prev.map((proj) =>
          proj.projectKey === editingProject.projectKey ? { ...proj, ...data } : proj
        )
      );
    } else {
      const newProject = {
        ...data,
        projectKey: `PRJ-${Date.now()}`,
      };
      setProjects((prev) => [...prev, newProject]);
    }
    setEditingProject(undefined);
    setShowModal(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDelete = (projectKey: string) => {
    setProjects((prev) => prev.filter((p) => p.projectKey !== projectKey));
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
       console.log("Filtering:", project.riskLevel, filters.riskLevel);
      return (
        filters.riskLevel === "" || project.riskLevel === filters.riskLevel
      );
    });
  }, [projects, filters.riskLevel]);
  console.log("Filtered Projects:", filteredProjects);

  return (
    <div className="p-6 bg-[var(--background)] min-h-screen text-[var(--text)]">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-[var(--muted)]">
          Showing {filteredProjects.length} project
          {filteredProjects.length !== 1 ? "s" : ""}
        </div>

        <button
          className="bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-lg shadow transition"
          onClick={() => {
            setEditingProject(undefined);
            setShowModal(true);
          }}
        >
          + Create Project
        </button>
      </div>

      {/* Filters */}
      <ProjectFilter
        filters={filters}
        setFilters={setFilters}
        view={view}
        setView={setView}
      />

      {/* Main View */}
      <div className="mt-6">
        {filteredProjects.length === 0 ? (
          <div className="text-[var(--muted)]">No projects found.</div>
        ) : (
          <ProjectTable
            projects={filteredProjects}
            onEdit={handleEdit}
            onDelete={handleDelete}
            viewMode={view}
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <CreateProjectModal
          onClose={() => {
            setShowModal(false);
            setEditingProject(undefined);
          }}
          onCreate={handleCreateOrUpdate}
          project={editingProject}
        />
      )}
    </div>
  );
}
