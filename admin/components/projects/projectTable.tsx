"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, Search, Filter, CircleSlash } from "lucide-react";
import { fetchProjects, ProjectDto } from "../../utils/Jira";
import ViewProjectButton from "../ui/ViewProjectButton";
import PaginationFooter from "@/components/footer/PaginationFooter";
import { FolderKanban } from "lucide-react";

const Progress = ({ value }: { value: number }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
      <span>{Math.round(value)}%</span>
      <span>Completed</span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const Badge = ({
  variant = "default",
  children,
}: {
  variant?: "default" | "destructive" | "success" | "warning";
  children: React.ReactNode;
}) => {
  const variantClasses: Record<string, string> = {
    default: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200",
    destructive: "bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300",
    success:
      "bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300",
    warning:
      "bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
};

const Input = ({
  className = "",
  ...props
}: {
  className?: string;
  [key: string]: any;
}) => (
  <div className="relative">
    <input
      className={`flex h-10 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pl-10 pr-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
  </div>
);

const Select = ({
  value,
  onValueChange,
  options,
  placeholder,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
}) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
      <Filter size={16} />
    </div>
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="h-10 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-100 pl-10 pr-10 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
  </div>
);

export const ProjectTable = () => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    healthLevel: "",
    search: "",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchProjects();
        setProjects(data);
        setError(null);
      } catch {
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const getHealthBadge = (level: number) => {
    switch (level) {
      case 0:
        return <Badge variant="success">On Track</Badge>;
      case 1:
        return <Badge variant="warning">Needs Attention</Badge>;
      case 2:
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getHealthLevel = (level: number) => {
    if (level === 0) return 1;
    if (level === 1) return 2;
    if (level === 2) return 3;
    return 0;
  };

  const filteredProjects = useMemo(() => {
    setCurrentPage(1);
    return projects.filter((project) => {
      const healthLevel = getHealthLevel(project.Health.Level);
      return (
        (filters.healthLevel === "" ||
          healthLevel.toString() === filters.healthLevel) &&
        (filters.search === "" ||
          project.Name.toLowerCase().includes(filters.search.toLowerCase()) ||
          project.Key.toLowerCase().includes(filters.search.toLowerCase()) ||
          (project.Lead &&
            project.Lead.toLowerCase().includes(filters.search.toLowerCase())))
      );
    });
  }, [projects, filters]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredProjects.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredProjects, currentPage, rowsPerPage]);

  const totalItems = filteredProjects.length;

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Loading projects...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 text-center max-w-2xl mx-auto my-10">
        <div className="text-red-500 dark:text-red-300 text-xl mb-2">
          ⚠️ Error
        </div>
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 text-gray-800 dark:text-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        {/* Left: Heading and Description */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Project Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Track and manage your projects effectively.
          </p>
        </div>

        {/* Right: Project Count Card */}
        <div className="bg-green-500 dark:bg-green-500 text-white px-2 py-1 rounded-xl shadow-md flex items-center gap-2 w-full md:w-auto">
          <div>
            {" "}
            <div className="text-sm opacity-90 flex gap-2">
              <FolderKanban className="w-4 h-4 text-white" />
              Total Projects
            </div>
            <div className="text-2xl font-bold text-center">{totalItems}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="w-full md:w-64">
          <Input
            placeholder="Search projects..."
            value={filters.search}
            onChange={(e: { target: { value: any } }) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
        </div>

        <div className="w-full md:w-56">
          <Select
            value={filters.healthLevel}
            onValueChange={(value) =>
              setFilters({ ...filters, healthLevel: value })
            }
            placeholder="Health Status"
            options={[
              { value: "1", label: "On Track" },
              { value: "2", label: "Needs Attention" },
              { value: "3", label: "Critical" },
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 text-sm font-medium">
            <tr>
              <th className="p-4 text-left">Project</th>
              <th className="p-4 text-left">Lead</th>
              <th className="p-4 text-left">Health</th>
              <th className="p-4 text-left">Progress</th>
              <th className="p-4 text-left">Story Points</th>
              <th className="p-4 text-left">Blockers</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.length > 0 ? (
              paginatedProjects.map((project, index) => (
                <tr
                  key={project.Id}
                  className={`
                    border-t border-gray-200 dark:border-gray-700
                    hover:bg-gray-50 dark:hover:bg-gray-700/30
                    transition-colors duration-150
                    ${
                      index % 2 === 0
                        ? "bg-gray-50/50 dark:bg-gray-800"
                        : "bg-white dark:bg-gray-800"
                    }
                  `}
                >
                  <td className="p-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {project.Name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {project.Key}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-800 dark:text-blue-200 text-xs">
                        {project.Lead?.charAt(0) || "?"}
                      </div>
                      <span>{project.Lead}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {getHealthBadge(project.Health.Level)}
                  </td>
                  <td className="p-4">
                    <Progress
                      value={
                        (project.Progress.CompletedTasks /
                          project.Progress.TotalTasks) *
                        100
                      }
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {project.Progress.StoryPointsCompleted}/
                        {project.Progress.StoryPointsTotal}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Story Points
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    {project.Progress.ActiveBlockers > 0 ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">
                          {project.Progress.ActiveBlockers} blocker
                          {project.Progress.ActiveBlockers !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <CircleSlash size={16} className="text-green-500" />
                        <span>None</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <ViewProjectButton projectKey={project.Key} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <Filter size={48} className="mb-4 opacity-50" />
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                      No projects found
                    </h3>
                    <p className="max-w-md">
                      Try adjusting your filters or search to find what you're
                      looking for.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="bg-white dark:bg-gray-800/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <PaginationFooter
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      )}
    </div>
  );
};
