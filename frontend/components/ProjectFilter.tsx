"use client";

import React from "react";
import { Sliders, User, Users, Flag, Folder, Briefcase } from "lucide-react";

interface ProjectFilterProps {
  filters: {
    status: string;
    priority: string;
    developerId: string;
    teamId: string;
    projectManagerId: string;
  };
  setFilters: (filters: ProjectFilterProps["filters"]) => void;
  developers: { id: string; name: string }[];
  teams: { id: string; name: string }[];
  managers: { id: string; name: string }[];
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({
  filters,
  setFilters,
  developers,
  teams,
  managers,
}) => {
  const filterItemClasses = `
    w-full
    px-3
    py-2
    text-sm
    rounded-lg
    border-[1px]
    transition-all
    bg-[var(--background)]
    text-[var(--text)]
    border-[var(--border)]
    placeholder-[var(--muted)]
    hover:border-[var(--text)]
    focus:border-[var(--text)]
    focus:ring-[1px]
    focus:ring-[var(--text)]
    focus:outline-none
    cursor-pointer
  `;

  return (
    <div className="space-y-4 p-2 rounded-lg bg-[var(--background)]">
      <div className="flex items-center gap-2 mb-2">
        <Sliders className="w-4 h-4 text-[var(--text)]" />
        <h2 className="text-medium font-semibold text-[var(--text)]">
          Filter Projects
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Status Filter */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <Folder className="w-4 h-4" />
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className={filterItemClasses}
          >
            <option value="">All Statuses</option>
            <option value="Open">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <Flag className="w-4 h-4" />
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
            className={filterItemClasses}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        {/* Developer Filter */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <User className="w-4 h-4" />
            Developer
          </label>
          <select
            value={filters.developerId}
            onChange={(e) =>
              setFilters({ ...filters, developerId: e.target.value })
            }
            className={filterItemClasses}
          >
            <option value="">All Developers</option>
            {developers.map((dev) => (
              <option key={dev.id} value={dev.id}>
                {dev.name}
              </option>
            ))}
          </select>
        </div>

        {/* Team Filter */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <Users className="w-4 h-4" />
            Team
          </label>
          <select
            value={filters.teamId}
            onChange={(e) => setFilters({ ...filters, teamId: e.target.value })}
            className={filterItemClasses}
          >
            <option value="">All Teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Manager Filter */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            <Briefcase className="w-4 h-4" />
            Manager
          </label>
          <select
            value={filters.projectManagerId}
            onChange={(e) =>
              setFilters({ ...filters, projectManagerId: e.target.value })
            }
            className={filterItemClasses}
          >
            <option value="">All Managers</option>
            {managers.map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Responsive Clear Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() =>
            setFilters({
              status: "",
              priority: "",
              developerId: "",
              teamId: "",
              projectManagerId: "",
            })
          }
          className="px-4 py-2 text-sm font-medium text-[var(--text)] hover:text-[var(--muted)] transition-colors cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[color:rgba(0,0,0,0.03)] dark:hover:bg-[color:rgba(255,255,255,0.05)]"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default ProjectFilter;
