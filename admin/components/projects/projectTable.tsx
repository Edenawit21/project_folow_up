"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { fetchProjects, ProjectDto } from "../../utils/Jira";
import ViewProjectButton from "../ui/ViewProjectButton";

const Progress = ({ value }: { value: number }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
    <div
      className="bg-blue-600 h-2 rounded-full transition-all"
      style={{ width: `${value}%` }}
    />
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
    destructive: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
    success:
      "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
    warning:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${variantClasses[variant]}`}
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
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
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
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-100 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export const ProjectTable = () => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    healthLevel: "",
    status: "",
    search: "",
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
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
      case 1:
        return <Badge variant="success">On Track</Badge>;
      case 2:
        return <Badge variant="warning">Needs Attention</Badge>;
      case 3:
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getHealthLevel = (reason: string) => {
    const lower = reason.toLowerCase();
    if (lower.includes("on track")) return 1;
    if (lower.includes("attention")) return 2;
    if (lower.includes("critical")) return 3;
    return 0;
  };

  const filteredProjects = projects.filter((project) => {
    const healthLevel = getHealthLevel(project.Health.Reason);
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

  if (loading)
    return (
      <div className="p-4 text-center text-gray-700 dark:text-gray-300">
        Loading projects...
      </div>
    );
  if (error)
    return (
      <div className="p-4 text-center text-red-500 dark:text-red-400">
        {error}
      </div>
    );

  return (
    <div className="space-y-4 p-4 text-gray-800 dark:text-gray-100">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={filters.search}
            onChange={(e: { target: { value: any; }; }) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
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
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
            placeholder="Project Status"
            options={[
              { value: "todo", label: "To Do" },
              { value: "on_progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
            ]}
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="p-4 text-left">Project</th>
              <th className="p-4 text-left">Lead</th>
              <th className="p-4 text-left">Health</th>
              <th className="p-4 text-left">Progress</th>
              <th className="p-4 text-left">Story Points</th>
              <th className="p-4 text-left">Blocker</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <tr
                  key={project.Id}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {project.Name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {project.Key}
                    </div>
                  </td>
                  <td className="p-4 text-gray-700 dark:text-gray-200">
                    {project.Lead}
                  </td>
                  <td className="p-4">
                    {getHealthBadge(project.Health.Level)}
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div>
                        {project.Progress.CompletedTasks} /{" "}
                        {project.Progress.TotalTasks} tasks
                      </div>
                      <Progress
                        value={
                          (project.Progress.CompletedTasks /
                            project.Progress.TotalTasks) *
                          100
                        }
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    {project.Progress.StoryPointsCompleted} /{" "}
                    {project.Progress.StoryPointsTotal} SP
                  </td>
                  <td className="p-4">
                    {project.Progress.ActiveBlockers > 0 ? (
                      <Badge variant="destructive">
                        {project.Progress.ActiveBlockers} blocker
                        {project.Progress.ActiveBlockers !== 1 ? "s" : ""}
                      </Badge>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        None
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <ViewProjectButton projectKey={project.Key} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No projects found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
