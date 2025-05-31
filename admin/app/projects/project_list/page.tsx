"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/types";
import ProjectFilter from "@/components/ProjectFilter";
import ProjectTable from "@/components/ProjectTable";
import { initialProjects } from "@/constants";
import { Plus } from "lucide-react";

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState({ riskLevel: "" });
  const [view, setView] = useState<"table" | "board" | "timeline" | "graph">(
    "table"
  );

  useEffect(() => {
    setProjects(initialProjects);
  }, []);

  const handleDelete = (projectKey: string) => {
    setProjects((prev) => prev.filter((p) => p.projectKey !== projectKey));
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      return (
        filters.riskLevel === "" || project.riskLevel === filters.riskLevel
      );
    });
  }, [projects, filters.riskLevel]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredProjects.length} project
          {filteredProjects.length !== 1 ? "s" : ""}
        </div>

        <button
          className="absolute top-20 right-4 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-sm transition shadow-md"
          onClick={() => router.push("/projects/add_project")}
        >
          <Plus size={12} />
          Create Project
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
          <div className="text-gray-500 dark:text-gray-400">
            No projects found.
          </div>
        ) : (
          <ProjectTable
            projects={filteredProjects}
            onEdit={() => alert("Edit removed.")}
            onDelete={handleDelete}
            viewMode={view}
          />
        )}
      </div>
    </div>
  );
}
