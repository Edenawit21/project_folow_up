"use client";

import React from "react";
import { Sliders, LayoutGrid, ShieldAlert } from "lucide-react";

interface ProjectFilterProps {
  filters: {
    riskLevel: string;
  };
  setFilters: (filters: { riskLevel: string }) => void;
  view: "table" | "board" | "timeline" | "graph";
  setView: (view: "table" | "board" | "timeline" | "graph") => void;
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

  const labelClasses = `
    flex items-center gap-1 text-xs font-medium text-[var(--muted)]
  `;

  return (
    <div className="space-y-3 p-2 rounded-lg bg-[var(--background)] overflow-x-auto">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sliders className="w-4 h-4 text-[var(--text)]" />
        <h2 className="text-m font-semibold text-[var(--text)]">Filter Projects</h2>
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
            onChange={(e) =>
              setFilters({ riskLevel: e.target.value })
            }
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
                setView(e.target.value as "table" | "board" | "timeline" | "graph")
              }
              className={filterItemClasses}
            >
              <option value="table">Table</option>
              <option value="board">Board</option>
              <option value="timeline">Timeline</option>
              <option value="graph">Graph</option>
            </select>

            <button
              onClick={() => setFilters({ riskLevel: "" })}
              className="px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:text-[var(--muted)] transition-colors cursor-pointer rounded border border-[var(--border)] bg-[var(--background)] hover:bg-[color:rgba(0,0,0,0.03)] dark:hover:bg-[color:rgba(255,255,255,0.05)]"
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
