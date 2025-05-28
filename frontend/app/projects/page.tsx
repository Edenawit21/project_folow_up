"use client";

import { useState, useEffect } from "react";
import { Project } from "@/types";
import ProjectFilter from "@/components/ProjectFilter";
import { ProjectFilterState, Entity } from "@/types";
import ProjectDashboard from "@/components/ProjectTable";
import { initialProjects } from "@/constants";
import CreateProjectModal from "@/components/CreateProjectModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<ProjectFilterState>({
    status: "",
    priority: "",
    developerId: "",
    teamId: "",
    projectManagerId: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  const developers: Entity[] = []; 
  const teams: Entity[] = [];      
  const managers: Entity[] = [];   
  useEffect(() => {
    setProjects(initialProjects);
  }, []);

  const handleCreateOrUpdate = (data: any) => {
    if (editingProject) {
      setProjects((prev) =>
        prev.map((proj) =>
          proj.projectKey === editingProject.projectKey
            ? { ...proj, ...data }
            : proj
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

  return (
    <div className="p-6 bg-[var(--background)] min-h-screen text-[var(--text)]">
      {/* Top bar with project count and create button */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-[var(--muted)]">
          Showing {projects.length} project{projects.length !== 1 ? "s" : ""}
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          onClick={() => {
            setEditingProject(undefined);
            setShowModal(true);
          }}
        >
          + Create Project
        </button>
      </div>

      {/* Filter bar */}
      <ProjectFilter
        filters={filters}
        setFilters={setFilters}
        developers={developers}
        teams={teams}
        managers={managers}
      />

      {/* Project table or fallback */}
      {projects.length === 0 ? (
        <div className="mt-6 text-[var(--muted)]">No projects found.</div>
      ) : (
        <div className="mt-6">
          <ProjectDashboard
            projects={projects}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

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
