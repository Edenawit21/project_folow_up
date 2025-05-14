"use client";

import React from "react";
import { projects } from "@/constants";
import { format, parseISO } from "date-fns";

// Helper: Group and sort projects by due month
const groupAndSortByMonth = (projects: typeof projects) => {
  const groups: Record<string, typeof projects> = {};

  projects.forEach((project) => {
    const date = parseISO(project.dueDate);
    const monthKey = format(date, "MMMM yyyy");
    if (!groups[monthKey]) groups[monthKey] = [];
    groups[monthKey].push(project);
  });

  return Object.entries(groups).sort(([a], [b]) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });
};

export default function MonthlyTimeline() {
  const groupedProjects = groupAndSortByMonth(projects);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Project Timeline by Month
      </h1>
      <div className="space-y-10">
        {groupedProjects.map(([month, items]) => (
          <div key={month} className="border-l-4 border-blue-500 pl-4">
            <h2 className="text-xl font-semibold text-blue-600 mb-4">{month}</h2>
            <ul className="space-y-4">
              {items.map((project) => (
                <li
                  key={project.id}
                  className="relative pl-6 before:absolute before:left-0 before:top-5 before:w-3 before:h-3 before:bg-blue-500 before:rounded-full bg-white shadow rounded-lg p-4 border-l-4 border-gray-200 hover:border-blue-400"
                >
                  <div className="text-lg font-medium text-gray-800">
                    {project.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {project.description}
                  </div>
                  <div className="text-sm text-gray-700 mt-2">
                    <span className="font-semibold">Due:</span>{" "}
                    {format(parseISO(project.dueDate), "PPP")}{" "}
                    | <span className="font-semibold">Team:</span> {project.team}
                    {" | "}
                    <span
                      className={`text-xs font-semibold ml-1 px-2 py-1 rounded-full ${
                        project.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : project.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : project.status === "Not Started"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
