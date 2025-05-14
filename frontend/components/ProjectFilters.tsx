import React from "react";
import { Priority, Status } from "@/types";

interface ProjectFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: {
    priority: string;
    status: string;
    team: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      priority: string;
      status: string;
      team: string;
    }>
  >;
  teams: string[];
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  teams,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <input
        type="text"
        placeholder="Search Projects"
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded px-3 py-2 w-full md:w-72"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <select
          value={filters.priority}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priority: e.target.value }))
          }
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded"
        >
          <option value="">All Priorities</option>
          <option value={Priority.Urgent}>Urgent</option>
          <option value={Priority.High}>High</option>
          <option value={Priority.Medium}>Medium</option>
          <option value={Priority.Low}>Low</option>
          <option value={Priority.Backlog}>Backlog</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value={Status.ToDo}>To Do</option>
          <option value={Status.WorkInProgress}>Work In Progress</option>
          <option value={Status.UnderReview}>Under Review</option>
          <option value={Status.Completed}>Completed</option>
        </select>

        <select
          value={filters.team}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, team: e.target.value }))
          }
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded"
        >
          <option value="">All Teams</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProjectFilters;
