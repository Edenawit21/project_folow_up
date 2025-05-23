"use client";

import { useState, useEffect } from "react";
import { Project } from "@/types";
import ProjectFilter from "@/components/ProjectFilter";
import { ProjectFilterState, Entity } from "@/types";
import ProjectDashboard from "@/components/ProjectTable";
import { initialProjects } from "@/constants";

// Replace this with your actual constant or move to a separate file


export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<ProjectFilterState>({
    status: "",
    priority: "",
    developerId: "",
    teamId: "",
    projectManagerId: "",
  });

  const developers: Entity[] = []; // Mock for now
  const teams: Entity[] = []; // Mock for now
  const managers: Entity[] = []; // Mock for now

  useEffect(() => {
    setProjects(initialProjects);
  }, []);

  return (
    <div className="p-6 bg-[var(--background)] min-h-screen text-[var(--text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="text-sm text-[var(--muted)]">
          Showing {projects.length} project{projects.length !== 1 ? "s" : ""}
        </div>
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
          <ProjectDashboard projects={projects} />
        </div>
      )}
    </div>
  );
}
