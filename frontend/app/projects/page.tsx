"use client";

import { useState, useMemo, useEffect } from "react";
import { Project, ProjectFilterState, Entity } from "@/types";
import ProjectFilter from "@/components/ProjectFilter";
import ProjectDashboard from "@/components/ProjectTable"; 
import { initialProjects } from "@/constants";

export default function ProjectsPage() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<ProjectFilterState>({
    status: "",
    priority: "",
    developerId: "",
    teamId: "",
    projectManagerId: "",
  });

  // Extract unique developers from projects
  const developers: Entity[] = useMemo(() => {
    const devs = new Set<string>();
    initialProjects.forEach((p) => p.developers?.forEach((d) => devs.add(d)));
    return Array.from(devs).map((d) => ({ id: d, name: d }));
  }, []);

  // Extract unique project managers
  const managers: Entity[] = useMemo(() => {
    const mgrs = new Set(initialProjects.map((p) => p.projectManager));
    return Array.from(mgrs).map((m) => ({ id: m, name: m }));
  }, []);

  // Extract unique teams (project categories)
  const teams: Entity[] = useMemo(() => {
    const cats = new Set(
      initialProjects
        .map((p) => p.projectCategory)
        .filter((c): c is string => typeof c === "string")
    );
    return Array.from(cats).map((c) => ({ id: c, name: c }));
  }, []);
  

  // Filter projects whenever filters or allProjects change
  useEffect(() => {
    const filtered = allProjects.filter((project) => {
      const matchManager =
        !filters.projectManagerId ||
        project.projectManager === filters.projectManagerId;
      const matchDeveloper =
        !filters.developerId ||
        project.developers?.includes(filters.developerId);
      const matchTeam =
        !filters.teamId || project.projectCategory === filters.teamId;

      // You may add status and priority filtering here if relevant fields exist

      return matchManager && matchDeveloper && matchTeam;
    });
    setFilteredProjects(filtered);
  }, [filters, allProjects]);

  return (
    <div className="p-6 bg-[var(--background)] min-h-screen text-[var(--text)] space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <span className="text-sm text-[var(--muted)]">
          Showing {filteredProjects.length} project
          {filteredProjects.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Project filtering controls */}
      <ProjectFilter
        filters={filters}
        setFilters={setFilters}
        developers={developers}
        teams={teams}
        managers={managers}
      />

      {/* Conditionally show dashboard or no projects message */}
      {filteredProjects.length === 0 ? (
        <div className="text-center text-[var(--muted)] mt-12">
          🚫 No projects match your filters.
        </div>
      ) : (
        <ProjectDashboard projects={filteredProjects} />
      )}
    </div>
  );
}
