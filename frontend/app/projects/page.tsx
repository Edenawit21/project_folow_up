"use client";

import { useEffect, useState } from "react";
import { fetchProjects } from "@/utils/Jira";
import { Project } from "@/types";
import ProjectFilter from "@/components/ProjectFilter";
import ProjectTable from "@/components/ProjectTable";
import { ProjectFilterState, Entity } from "@/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ProjectFilterState>({
    status: "",
    priority: "",
    developerId: "",
    teamId: "",
    projectManagerId: "",
  });

  // Temporary placeholder entities (should come from an API ideally)
  const developers: Entity[] = [];
  const teams: Entity[] = [];
  const managers: Entity[] = [];

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
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

      {loading && (
        <div className="mt-6 text-[var(--muted)]">Loading projects...</div>
      )}

      {error && <div className="mt-6 text-red-500 font-medium">{error}</div>}

      {!loading && !error && projects.length === 0 && (
        <div className="mt-6 text-[var(--muted)]">No projects found.</div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="mt-6">
          <ProjectTable projects={projects} />
        </div>
      )}
    </div>
  );
}
