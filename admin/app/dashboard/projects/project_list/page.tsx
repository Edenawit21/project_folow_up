"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/types";
import ProjectFilter from "@/components/ProjectFilter";
import ProjectTable from "@/components/projects/ProjectList";
import { initialProjects } from "@/constants";
import PaginationFooter from "@/components/footer/PaginationFooter";
import { Plus } from "lucide-react";

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState({ projectHealth: "" });
  const [view, setView] = useState<"table" | "board">("table");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setProjects(initialProjects);
  }, []);

  const handleDelete = (projectKey: string) => {
    setProjects((prev) => prev.filter((p) => p.projectKey !== projectKey));
  };

  const onCreateClick = () => {
    router.push("/dashboard/projects/add_project");
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      return (
        filters.projectHealth === "" ||
        project.projectHealth === filters.projectHealth
      );
    });
  }, [projects, filters.projectHealth]);

  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);

  // Reset page when rowsPerPage changes or page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [rowsPerPage, totalPages]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredProjects.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredProjects, currentPage, rowsPerPage]);

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
          onClick={onCreateClick}
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
          <>
            <ProjectTable projects={paginatedProjects} viewMode={view} />
            <PaginationFooter
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalItems={filteredProjects.length}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={setRowsPerPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
