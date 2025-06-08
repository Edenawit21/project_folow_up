"use client";

import React from "react";
import { Project } from "@/types";
import moment from "moment";

interface ProjectDashboardProps {
  projects?: Project[];
  viewMode: "table" | "board";
  filters?: {
    projectHealth?: string;
  };
}

export default function ProjectDashboard({
  projects = [],
  viewMode,
  filters = { projectHealth: "" },
}: ProjectDashboardProps) {
  const filteredProjects = filters.projectHealth
    ? projects.filter((p) => p.projectHealth === filters.projectHealth)
    : projects;

  const boardGroups = Array.from(
    new Set(filteredProjects.map((p) => p.projectHealth || "Unknown"))
  );

  return (
    <div className="px-2 py-4 text-gray-900 dark:text-white">
      {viewMode === "table" && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-1">
            <thead className="text-left text-sm font-medium text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {[
                  "Key",
                  "Project Name",
                  "Manager",
                  "Project Health",
                  "Done",
                  "In Progress",
                  "Total Issues",
                  "SP Done",
                  "Total SP",
                  "Synced at",
                ].map((header) => (
                  <th key={header} className="px-3 py-2 whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <tr
                  key={p.projectKey}
                  className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition rounded-md shadow-sm"
                >
                  <td className="px-3 py-2 text-sm">{p.projectKey}</td>
                  <td className="px-3 py-2 text-sm">{p.projectName}</td>
                  <td className="px-3 py-2 text-sm">{p.projectManager}</td>
                  <td className="px-3 py-2 text-sm">{p.projectHealth || "—"}</td>
                  <td className="px-3 py-2 text-sm">{p.issuesDone}</td>
                  <td className="px-3 py-2 text-sm">{p.issuesInProgress}</td>
                  <td className="px-3 py-2 text-sm">{p.totalIssues}</td>
                  <td className="px-3 py-2 text-sm">{p.storyPointsDone}</td>
                  <td className="px-3 py-2 text-sm">{p.totalStoryPoint}</td>
                  <td className="px-3 py-2 text-sm">
                    {moment(p.lastSyncedAt).format("YYYY-MM-DD")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{viewMode === "board" && (
        <div className="flex gap-6 mt-6">
          {boardGroups.map((health) => (
            <div
              key={health}
              className="flex-1 rounded p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                {health.toUpperCase()}
              </h3>
              {filteredProjects
                .filter((p) => p.projectHealth === health)
                .map((p) => (
                  <div
                    key={p.projectKey}
                    className="rounded p-3 mb-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  >
                    <strong>{p.projectName}</strong>
                    <div>Manager: {p.projectManager}</div>
                    <div>
                      Issues: {p.issuesDone}/{p.totalIssues}
                    </div>
                    <div>
                      Story Points: {p.storyPointsDone}/{p.totalStoryPoint}
                    </div>
                    <div>
                      Synced: {moment(p.lastSyncedAt).format("YYYY-MM-DD")}
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