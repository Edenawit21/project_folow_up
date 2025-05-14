"use client";
import React from "react";
import { projects } from "@/constants";
import { format, parseISO } from "date-fns";

// Helper to group and sort projects by due month
const groupAndSortByMonth = (projects: typeof projects) => {
  const groups: Record<string, typeof projects> = {};

  projects.forEach((project) => {
    const date = parseISO(project.dueDate);
    const monthKey = format(date, "MMMM yyyy");
    if (!groups[monthKey]) groups[monthKey] = [];
    groups[monthKey].push(project);
  });

  // Sort months chronologically
  const sortedEntries = Object.entries(groups).sort(([a], [b]) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });

  return sortedEntries;
};

export default function MonthlyTimeline() {
  const groupedProjects = groupAndSortByMonth(projects);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Project Timeline by Month</h1>
      <div className="space-y-8">
        {groupedProjects.map(([month, items]) => (
          <div key={month} className="border-l-4 border-blue-500 pl-4">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">{month}</h2>
            <ul className="space-y-2">
              {items.map((project) => (
                <li
                  key={project.id}
                  className="bg-white shadow rounded p-4 border-l-4 border-gray-200 hover:border-blue-400"
                >
                  <div className="font-medium text-lg">{project.name}</div>
                  <div className="text-sm text-gray-600">{project.description}</div>
                  <div className="text-sm mt-1">
                    <span className="font-semibold">Due:</span> {project.dueDate} |{" "}
                    <span className="font-semibold">Team:</span> {project.team} |{" "}
                    <span className="font-semibold">Status:</span> {project.status}
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
