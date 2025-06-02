"use client";

import React from "react";
import { Sliders, LayoutGrid, ShieldAlert } from "lucide-react";

interface ProjectFilterProps {
  filters: {
    riskLevel: string;
  };
  setFilters: (filters: { riskLevel: string }) => void;
  view: "table" | "board";
  setView: (view: "table" | "board") => void;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({
  filters,
  setFilters,
  view,
  setView,
}) => {
  const filterItemClasses = `
    min-w-[155px]
    px-2
    py-1.5
    text-sm
    rounded-md
    border
    transition-all
    bg-white
    text-gray-900
    border-gray-300
    placeholder-gray-400
    hover:border-gray-500
    focus:border-gray-700
    focus:ring-1
    focus:ring-gray-700
    focus:outline-none
    cursor-pointer
    dark:bg-gray-900
    dark:text-gray-100
    dark:border-gray-700
    dark:placeholder-gray-500
    dark:hover:border-gray-400
    dark:focus:border-gray-200
    dark:focus:ring-gray-200
  `;

  const labelClasses = `
    flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400
  `;

  return (
    <div className="space-y-3 p-2 rounded-lg bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sliders className="w-4 h-4 text-gray-800 dark:text-gray-100" />
        <h2 className="text-m font-semibold text-gray-900 dark:text-white">
          Filter Projects
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 overflow-x-auto pb-2">
        {/* Risk Level */}
        <div className="flex flex-col space-y-1">
          <label className={labelClasses}>
            <ShieldAlert className="w-4 h-4" />
            Risk Level
          </label>
          <select
            value={filters.riskLevel}
            onChange={(e) => setFilters({ riskLevel: e.target.value })}
            className={filterItemClasses}
          >
            <option value="">All risk levels</option>
            <option value="on track">on track</option>
            <option value="medium risk">medium risk</option>
            <option value="high risk">high risk</option>
          </select>
        </div>

        {/* View Mode + Clear Filter */}
        <div className="flex flex-col space-y-1">
          <label className={labelClasses}>
            <LayoutGrid className="w-4 h-4" />
            View Project
          </label>
          <div className="flex gap-2 items-center">
            <select
              value={view}
              onChange={(e) =>
                setView(
                  e.target.value as "table" | "board")
              }
              className={filterItemClasses}
            >
              <option value="table">Table</option>
              <option value="board">Board</option>
            </select>

            <button
              onClick={() => setFilters({ riskLevel: "" })}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white transition-colors cursor-pointer rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Clear filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilter;
