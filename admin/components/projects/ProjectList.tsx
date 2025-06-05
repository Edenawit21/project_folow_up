"use client";

import React from "react";
import { Project } from "@/types";
import moment from "moment";

interface ProjectDashboardProps {
  projects?: Project[];
  onEdit: (updatedProject: Project) => void;
  onDelete: (projectKey: string) => void;
  viewMode: "table" | "board";
  filters?: {
    riskLevel?: string;
  };
}

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ProjectDashboard({
  projects = [],
  onEdit,
  onDelete,
  viewMode,
  filters = { riskLevel: "" },
}: ProjectDashboardProps) {
  const filteredProjects = filters.riskLevel
    ? projects.filter((p) => p.riskLevel === filters.riskLevel)
    : projects;

  const boardGroups = Array.from(
    new Set(filteredProjects.map((p) => p.riskLevel ||  "Unknown"))
  );

  const riskCount = boardGroups.map((risk) => ({
    name: risk,
    value: filteredProjects.filter((p) => p.riskLevel === risk).length,
  }));

  return (
    <div className="p-4 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      {viewMode === "table" && (
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {[
                "Key",
                "Name",
                "Manager",
                "Risk",
                "Issues Done",
                "In Progress",
                "Total Issues",
                "Story Points Done",
                "Total Story Point",
                "Last Synced",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="border p-2 font-medium border-gray-300 dark:border-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((p) => (
              <tr
                key={p.projectKey}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
              >
                <td className="border p-2 border-gray-300 dark:border-gray-700">
                  {p.projectKey}
                </td>
                <td className="border p-2 border-gray-300 dark:border-gray-700">
                  {p.projectName}
                </td>
                <td className="border p-2 border-gray-300 dark:border-gray-700">
                  {p.projectManager}
                </td>
                <td className="border p-2 border-gray-300 dark:border-gray-700">
                  {p.riskLevel || "Unknown"}
                </td>
                <td className="border p-2 border-gray-300 dark:border-gray-700">
                  {p.issuesDone}
                </td>
                <td className="border p-2 border-gray-300 dark:border-gray-700">
                  {p.issuesInProgress}
                </td>
                <td className="border p-2 border-gray-300 dark:border-gray-700">
                  {p.totalIssues}
                </td>
                <td className="border p-2 border-gray-300 dark:border-gray-700">
                  {p.storyPointsDone}
                </td>
                <td className="border p-2 border-gray-300 dark:border-gray-700">
                  {p.totalStoryPoint}
                </td>
                <td className="border p-2 border-gray-300 dark:border-gray-700">
                  {moment(p.lastSyncedAt).format("YYYY-MM-DD")}
                </td>
                <td className="border p-2 text-center border-gray-300 dark:border-gray-700">
                  <ActionMenu
                    onEdit={() => onEdit(p)}
                    onDelete={() => onDelete(p.projectKey)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

{viewMode === "board" && (
        <div className="flex gap-6">
          {boardGroups.map((risk) => (
            <div
              key={risk}
              className="flex-1 rounded p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                {risk.toUpperCase()}
              </h3>
              {filteredProjects
                .filter((p) => p.riskLevel === risk)
                .map((p) => (
                  <div
                    key={p.projectKey}
                    className="rounded shadow-sm p-3 mb-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <strong>{p.projectName}</strong>
                    <div>Manager: {p.projectManager}</div>
                    <div>
                      Issues: {p.issuesDone}/{p.totalIssues}
                    </div>
                    <div>
                      Story Points: {p.storyPointsDone}/{p.totalStoryPoint}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Actions menu"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 4a2 2 0 110-4 2 2 0 010 4zm0 4a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}