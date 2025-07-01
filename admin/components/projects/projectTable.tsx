"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronDown,
  Search,
  Filter,
  FolderKanban,
  CircleSlash,
} from "lucide-react";
import { fetchProjects, ProjectDto, ProjectFilterDto } from "../../utils/Jira";
import ViewProjectButton from "../ui/ViewProjectButton";
import EditProjectButton from "../ui/EditProjectButton";
import PaginationFooter from "@/components/footer/PaginationFooter";
import Link from "next/link";

const Progress = ({ completed, total }: { completed: number; total: number }) => {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-300">
      <div className="flex justify-between text-xs mb-1">
        <span>{completed} / {total} Tasks</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

const Badge = ({ variant = "default", children }: { variant?: "default" | "destructive" | "success" | "warning"; children: React.ReactNode }) => {
  const variantClasses = {
    default: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200",
    destructive: "bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300",
    success: "bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300",
    warning: "bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${variantClasses[variant]}`}>{children}</span>
  );
};

// Modified Input component to handle form submission
const Input = ({ value, onChange, onClear, onSearchSubmit, ...props }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onClear?: () => void; onSearchSubmit?: (e: React.FormEvent) => void; [key: string]: any }) => (
  // Wrap the input in a form to enable submission on Enter key
  <form onSubmit={onSearchSubmit} className="relative w-full sm:max-w-md">
    <input
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
      {...props}
    />
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
    {value && (
      <button
        type="button" // Important: Use type="button" to prevent it from submitting the form
        onClick={onClear}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        aria-label="Clear search"
      >
        ✕
      </button>
    )}
    {/* No explicit search button needed here, form submission (Enter key) triggers it */}
  </form>
);

const Select = ({ value, onValueChange, options, placeholder }: { value: string; onValueChange: (value: string) => void; options: { label: string; value: string }[]; placeholder: string }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
      <Filter size={16} />
    </div>
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
      aria-label={placeholder}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const EmptyState = () => (
  <tr>
    <td colSpan={10} className="py-16 text-center">
      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
<Filter size={48} className="mb-4 opacity-50" />
        <h3 className="text-xl font-medium mb-2">No projects found</h3>
        <p className="max-w-md">Try adjusting your filters or search to find what you're looking for.</p>
      </div>
    </td>
  </tr>
);

const ProjectRow = ({ project }: { project: ProjectDto }) => {
  const getHealthBadge = (level: number) => {
    switch (level) {
      case 0: return <Badge variant="success">On Track</Badge>;
      case 1: return <Badge variant="warning">Needs Attention</Badge>;
      case 2: return <Badge variant="destructive">Critical</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  return (
    <tr className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150">
      <td className="p-3">
        <Link href={`/dashboard/overview/${project.Id}`} className="font-semibold text-gray-900 dark:text-white hover:underline">
          {project.Name}<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{project.Key}</div>
        </Link>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-800 dark:text-blue-200 text-xs">
            {project.Lead?.charAt(0) || "?"}
          </div>
          <span>{project.Lead}</span>
        </div>
      </td>
      <td className="p-3">
        <Badge variant={project.Status === "Active" ? "success" : "default"}>{project.Status || "Unknown"}</Badge>
      </td>
      <td className="p-3">
        <div className="flex flex-col">
          <span className="font-medium">{project.ProjectOwner?.Name || "N/A"}</span>
          {project.ProjectOwner?.ContactInfo && <span className="text-xs text-gray-500 dark:text-gray-400">{project.ProjectOwner.ContactInfo}</span>}
        </div>
      </td>
      <td className="p-3">
        <div className="flex flex-col">
          <span className="font-medium">{project.TargetEndDate ? new Date(project.TargetEndDate).toLocaleDateString() : "N/A"}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Target End Date</span>
        </div>
      </td>
      <td className="p-3">{getHealthBadge(project.Health.Level)}</td>
      <td className="p-3">
        <Progress completed={project.Progress.CompletedTasks} total={project.Progress.TotalTasks} />
      </td>
      <td className="p-3">
        <div className="flex flex-col">
          <span className="font-medium">{project.Progress.StoryPointsCompleted}/{project.Progress.StoryPointsTotal}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Story Points</span>
        </div>
      </td>
      <td className="p-3">
        {project.Progress.ActiveBlockers > 0 ? (
          <Badge variant="destructive">{project.Progress.ActiveBlockers} blocker{project.Progress.ActiveBlockers !== 1 ? "s" : ""}</Badge>
        ) : (
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <CircleSlash size={16} className="text-green-500" /> <span>None</span>
          </div>
        )}
      </td>
      <td className="p-3 text-right space-x-2">
        <ViewProjectButton projectKey={project.Key} />
        <EditProjectButton projectId={project.Id} />
      </td>
    </tr>
  );
};

export const ProjectTable = () => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for the input field's value
  const [effectiveSearchTerm, setEffectiveSearchTerm] = useState(""); // State that triggers the actual search API call
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProjectFilterDto>({
    pageNumber: 1,
    pageSize: 15,
    SortBy: 'Name',
    SortDescending: false
  });
  const [totalCount, setTotalCount] = useState(0);

  // Memoized function to fetch projects
  const loadProjects = useCallback(
  async () => {
    try {
      setLoading(true);
      // Create a copy of filter with the effective search term applied
      const apiFilter = {
        ...filter,
        SearchTerm: effectiveSearchTerm || undefined // Use effectiveSearchTerm for API call
      };
      const { items, totalCount } = await fetchProjects(apiFilter);
      setProjects(items);
      setTotalCount(totalCount);
    } catch (err) {
      setError("Failed to load projects. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, effectiveSearchTerm]); // Dependencies for loadProjects

  // Trigger project fetch whenever filter or effectiveSearchTerm changes
  useEffect(() => {
    loadProjects();
  }, [loadProjects]); // Dependency is the memoized loadProjects function

  // Handle search input change (updates searchTerm, but not effectiveSearchTerm)
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle search submission (e.g., on Enter key press or explicit search button click)
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    setEffectiveSearchTerm(searchTerm); // Update effectiveSearchTerm to trigger API call
    setFilter(prev => ({ ...prev, pageNumber: 1 })); // Reset to first page on new search
  }, [searchTerm]); // searchTerm is a dependency here

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setSearchTerm(""); 
    setEffectiveSearchTerm("");
    setFilter(prev => ({
      ...prev,
      pageNumber: 1
    }));
  }, []);

  // Handle health level filter
  const handleHealthFilter = useCallback((value: string) => {
    setFilter(prev => ({
      ...prev,
      HealthLevel: value ? Number(value) : undefined,
      pageNumber: 1
    }));
  }, []);

  // Handle status filter
  const handleStatusFilter = useCallback((value: string) => {
    setFilter(prev => ({
      ...prev,
      Status: value || undefined,
      pageNumber: 1
    }));
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setFilter(prev => ({ ...prev, pageNumber: page }));
  }, []);

  // Handle rows per page change
  const handleRowsPerPageChange = useCallback((pageSize: number) => {
    setFilter(prev => ({ ...prev, pageSize, pageNumber: 1 }));
  }, []);

  if (loading) return <div className="text-center py-20">Loading projects...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <div className="space-y-6 p-4 sm:p-6 text-gray-800 dark:text-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Project Dashboard</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 italic text-sm">Track and manage your projects effectively.</p>
        </div>
        <div className="px-4 py-3 rounded-2xl flex items-center gap-3 w-full md:w-auto">
          <div className="space-y-1">
            <div className="text-sm font-medium flex items-center gap-2 opacity-90">
              <FolderKanban className="w-4 h-4 animate-bounce-slow" /><span>Total Projects</span>
            </div>
            <div className="text-3xl font-extrabold text-center tracking-wide">{totalCount}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search projects..."
            value={searchTerm} 
            onChange={handleSearchChange} 
            onClear={handleClearSearch}
            onSearchSubmit={handleSearchSubmit} 
          />
        </div>
        <div className="w-full md:w-56">
          <Select
            value={filter.HealthLevel?.toString() || ''}
            onValueChange={handleHealthFilter}
            placeholder="Health Status"
            options={[

{ value: "0", label: "On Track" },
              { value: "1", label: "Needs Attention" },
              { value: "2", label: "Critical" },
            ]}
          />
        </div>
        <div className="w-full md:w-56">
          <Select
            value={filter.Status || ''}
            onValueChange={handleStatusFilter}
            placeholder="Project Status"
            options={[
              { value: "NotStarted", label: "Active" }, 
              { value: "Active", label: "In Progress" }, 
              { value: "OnHold", label: "On Hold" },
              { value: "Completed", label: "Completed" },
              { value: "Cancelled", label: "Cancelled" },
              { value: "Archived", label: "Archived" },
            ]}
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-gray-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 text-sm font-medium">
            <tr>
              <th
                className="p-2 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setFilter(prev => ({
                  ...prev,
                  SortBy: 'Name',
                  SortDescending: prev.SortBy === 'Name' ? !prev.SortDescending : false,
                  pageNumber: 1
                }))}
              >
                Project {filter.SortBy === 'Name' && (filter.SortDescending ? '↓' : '↑')}
              </th>
              <th className="p-2 text-left">Lead</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Product Owner</th>
              <th className="p-2 text-left">Target End Date</th>
              <th className="p-2 text-left">Health</th>
              <th className="p-2 text-left">Progress</th>
              <th className="p-2 text-left">Story Points</th>
              <th className="p-2 text-left">Blockers</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => <ProjectRow key={project.Id} project={project} />)
            ) : (
              <EmptyState />
            )}
          </tbody>
        </table>
      </div>

      <PaginationFooter
        currentPage={filter.pageNumber ?? 1}
        rowsPerPage={filter.pageSize ?? 15}
        totalItems={totalCount}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
};