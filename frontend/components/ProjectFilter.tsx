"use client";

import React from "react";

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
  const baseSelectClasses = `
    w-full
    border
    rounded-md
    p-2
    bg-[var(--background)]
    border-[var(--border)]
    text-[var(--text)]
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
  `;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Status */}
      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        className={baseSelectClasses}
      >
        <option value="">All</option>
        <option value="Open">To Do</option>
        <option value="InProgress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Priority */}
      <select
        value={filters.priority}
        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        className={baseSelectClasses}
      >
        <option value="">All</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>

      {/* Assigned Developer */}
      <select
        value={filters.developerId}
        onChange={(e) =>
          setFilters({ ...filters, developerId: e.target.value })
        }
        className={baseSelectClasses}
      >
        <option value="">All</option>
        {developers.map((dev) => (
          <option key={dev.id} value={dev.id}>
            {dev.name}
          </option>
        ))}
      </select>

      {/* Team */}
      <select
        value={filters.teamId}
        onChange={(e) => setFilters({ ...filters, teamId: e.target.value })}
        className={baseSelectClasses}
      >
        <option value="">All</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

      {/* Project Manager */}
      <select
        value={filters.projectManagerId}
        onChange={(e) =>
          setFilters({ ...filters, projectManagerId: e.target.value })
        }
        className={baseSelectClasses}
      >
        <option value="">All</option>
        {managers.map((pm) => (
          <option key={pm.id} value={pm.id}>
            {pm.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectFilter;
