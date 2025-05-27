"use client";

import { useState, useEffect } from "react";
import { Project, FormProject, ProjectFilterState, Entity } from "@/types";
import ProjectFilter from "@/components/ProjectFilter";
import ProjectDashboard from "@/components/ProjectTable";
import CreateProjectModal from "@/components/CreateProjectModal";
import { initialProjects } from "@/constants";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [filters, setFilters] = useState<ProjectFilterState>({
    status: "",
    priority: "",
    developerId: "",
    teamId: "",
    projectManagerId: "",
  });

  const developers: Entity[] = [];
  const teams: Entity[] = [];
  const managers: Entity[] = [];

  useEffect(() => {
    setProjects(initialProjects);
  }, []);

  const handleCreateProject = (newProject: FormProject) => {
    const transformed: Project = {
      projectKey: `PRJ-${projects.length + 1}`,
      projectName: newProject.title || "Untitled Project",
      projectManager: newProject.manager || "Unknown",
      totalIssues: 0,
      issuesDone: 0,
      issuesInProgress: 0,
      totalStoryPoint: 0,
      storyPointsDone: 0,
      riskLevel: "Low",
      lastSyncedAt: new Date().toISOString(),

      title: newProject.title,
      description: newProject.description,
      manager: newProject.manager,
      owner: newProject.owner,
      teamLeader: newProject.teamLeader,
      priority: newProject.priority,
      status: newProject.status,
      developers: Array.isArray(newProject.developers)
        ? newProject.developers
        : [],
    };

    setProjects((prev) => [...prev, transformed]);
    setShowCreateModal(false);
  };

  const handleUpdateProject = (updatedProject: FormProject) => {
    if (!editingProject) return;

    const transformed: Project = {
      ...editingProject,
      projectName: updatedProject.title || editingProject.projectName,
      projectManager: updatedProject.manager || editingProject.projectManager,
      title: updatedProject.title,
      description: updatedProject.description,
      manager: updatedProject.manager,
      owner: updatedProject.owner,
      teamLeader: updatedProject.teamLeader,
      priority: updatedProject.priority,
      status: updatedProject.status,
      developers: Array.isArray(updatedProject.developers)
        ? updatedProject.developers
        : [],
      lastSyncedAt: new Date().toISOString(),
    };

    setProjects((prev) =>
      prev.map((p) => (p.projectKey === editingProject.projectKey ? transformed : p))
    );
    setEditingProject(null);
    setShowCreateModal(false);
  };

  const handleDeleteProject = (projectKey: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects((prev) => prev.filter((p) => p.projectKey !== projectKey));
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setShowCreateModal(true);
  };

  return (
    <div className="p-6 bg-[var(--background)] min-h-screen text-[var(--text)]">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-[var(--muted)]">
          Showing {projects.length} project{projects.length !== 1 ? "s" : ""}
        </div>

        <button
          onClick={() => {
            setEditingProject(null);
            setShowCreateModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          + Create Project
        </button>
      </div>

      <ProjectFilter
        filters={filters}
        setFilters={setFilters}
        developers={developers}
        teams={teams}
        managers={managers}
      />

      {projects.length === 0 ? (
        <div className="mt-6 text-[var(--muted)]">No projects found.</div>
      ) : (
        <div className="mt-6">
          <ProjectDashboard
            projects={projects}
            onEdit={handleEditClick}
            onDelete={handleDeleteProject}
          />
        </div>
      )}

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreate={editingProject ? handleUpdateProject : handleCreateProject}
          project={editingProject ?? undefined}
        />
      )}
    </div>
  );
}
