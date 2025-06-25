import React from "react";
import { UserProject } from "@/types/userProject";

interface UserProjectTable {
  data: UserProject[];
  currentUserId: string;
  onShowMore: (projectId: string) => void;
}

const ProjectReportTable: React.FC<UserProjectTable> = ({
  data,
  currentUserId,
  onShowMore,
}) => {
  return (
    <div className="min-h-screen dark:bg-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto dark:bg-gray-800 p-6 sm:p-8">
        <div className="overflow-x-auto ">
          <table className="min-w-full divide-y dark:divide-gray-700">
            <thead className="dark:bg-gray-700">
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
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="dark:bg-gray-800 divide-y  dark:divide-gray-700">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No project data available.
                  </td>
                </tr>
              ) : (
                data.map((project, index) => (
                  <tr
                    key={project.projectId}
                    className={`${
                      index % 2 === 0 ? "dark:bg-gray-800" : "dark:bg-gray-700"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {project.projectName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {project.projectKey}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {project.totalTasksAssigned}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {project.completedTasks}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${project.taskCompletionPercentage}%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-gray-700 dark:text-gray-300 font-semibold">
                          {project.taskCompletionPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {project.totalStoryPointsAssigned}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {project.completedStoryPoints}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${project.storyPointCompletionPercentage}%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-gray-700 dark:text-gray-300 font-semibold">
                          {project.storyPointCompletionPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => onShowMore(project.projectId)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
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
      </div>
    </div>
  );
};

export default ProjectReportTable;
