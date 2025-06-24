"use client";

import React from 'react';
import { UserProject } from '@/types/userProject';

interface UserProjectTable {
  data: UserProject[];
  currentUserId: string;
  onShowMore: (projectId: string) => void;
}

const ProjectReportTable: React.FC<UserProjectTable> = ({ 
  data, 
  currentUserId,
  onShowMore 
}) => {
  return (
    <div className="bg-gray-50 font-sans p-4">
      <div className="mx-auto bg-white rounded-lg shadow-xl p-4 sm:p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task %</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total SP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Done SP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SP %</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No project data available.
                  </td>
                </tr>
              ) : (
                data.map((project, index) => (
                  <tr
                    key={project.projectId}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">
                      {project.projectName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{project.projectKey}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{project.totalTasksAssigned}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{project.completedTasks}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.taskCompletionPercentage}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-700 font-semibold">{project.taskCompletionPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{project.totalStoryPointsAssigned}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{project.completedStoryPoints}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${project.storyPointCompletionPercentage}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-700 font-semibold">{project.storyPointCompletionPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onShowMore(project.projectId)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Details
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