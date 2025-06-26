// src/components/usertable/ProjectReportTable.tsx (UPDATED)

"use client";

import React from "react";
// Ensure this path is correct and contains ProjectCompletionReport
import { ProjectCompletionReport } from "@/types/userProject";

interface ProjectReportTableProps {
  data: ProjectCompletionReport[];
  currentUserId: string; // Not directly used in rendering, but kept as per interface
  onShowMore: (projectId: string) => void;
}

const ProjectReportTable: React.FC<ProjectReportTableProps> = ({
  data,
  currentUserId,
  onShowMore,
}) => {
  return (
    // This div provides the table's border, shadow, background, and overflow handling.
    // The outermost page layout (max-width, overall padding/margins) is handled by the parent component.
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <table className="min-w-full">
        {/* Table Header Styling */}
        <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
          <tr>
            {[
              "Project Name",
              "Key",
              "Total Tasks",
              "Completed Tasks",
              "Task Completion",
              "Total SP",
              "Completed SP",
              "SP Completion",
              "Actions",
            ].map((header) => (
              <th
                key={header}
                className="px-4 py-4 text-left text-sm font-normal text-indigo-600 dark:text-indigo-200 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        {/* Table Body Styling */}
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={9} // Updated colspan to match the number of headers
                className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
              >
                <div className="flex flex-col items-center justify-center">
                  {/* Icon for empty state - a simple document icon */}
                  <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    No projects found
                  </h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    No project data available for this user.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((project, index) => (
              <tr
                key={project.projectId}
                // Maintain alternating row backgrounds
                className={`${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-700"
                } transition`}
              >
                {/* Table Data Cells */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {project.projectName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {project.projectKey}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {project.totalTasksAssigned}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {project.completedTasks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${project.taskCompletionPercentage}%`,
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-gray-700 dark:text-gray-200 font-semibold">
                      {project.taskCompletionPercentage}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {project.totalStoryPointsAssigned}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {project.completedStoryPoints}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${project.storyPointCompletionPercentage}%`,
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-gray-700 dark:text-gray-200 font-semibold">
                      {project.storyPointCompletionPercentage}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  <button
                    onClick={() => onShowMore(project.projectId)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors shadow-sm hover:shadow-md"
                  >
                    Show More
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectReportTable;