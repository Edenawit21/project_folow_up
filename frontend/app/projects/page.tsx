"use client";

import { useState, useEffect } from "react";
import { Project } from "@/types";
import ProjectFilter from "@/components/ProjectFilter";
import { ProjectFilterState, Entity } from "@/types";
import ProjectDashboard from "@/components/ProjectTable";
import { initialProjects } from "@/constants";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<ProjectFilterState>({
    status: "",
    priority: "",
    developerId: "",
    teamId: "",
    projectManagerId: "",
  });

  const developers: Entity[] = []; // Populate if needed
  const teams: Entity[] = [];      // Populate if needed
  const managers: Entity[] = [];   // Populate if needed

  useEffect(() => {
    setProjects(initialProjects);
  }, []);

  return (
    <div className="p-6 bg-[var(--background)] min-h-screen text-[var(--text)]">
      {/* Top bar with project count and create button */}
      <div className="flex justify-between items-center mb-6">
        {/* Left: Showing project count */}
        <div className="text-sm text-[var(--muted)]">
          Showing {projects.length} project{projects.length !== 1 ? "s" : ""}
        </div>

        {/* Right: Create project button */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
          onClick={() => {
            // TODO: Replace with modal or route navigation
            alert("Open create project modal or navigate to a form.");
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
          <ProjectDashboard projects={projects} />
        </div>
      )}
    </div>
  );
}
