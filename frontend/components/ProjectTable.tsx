"use client";

import { Project } from "@/types";

interface ProjectTableProps {
  projects: Project[];
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  if (!projects.length) {
    return (
      <div className="p-4 text-center text-[var(--muted)]">
        No projects found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-sm">
      <table className="min-w-full divide-y divide-[var(--border)]">
        <thead className="bg-[var(--background)]">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--text)] uppercase">
              ID
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--text)] uppercase">
              Name
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--text)] uppercase">
              Type
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--text)] uppercase">
              Category
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-[var(--text)] uppercase">
              Developers
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {projects.map((project) => (
            <tr
              key={project.id}
              className="hover:bg-[color:rgba(0,0,0,0.03)] dark:hover:bg-[color:rgba(255,255,255,0.05)] transition-colors"
            >
              <td className="px-4 py-2 text-sm text-[var(--text)]">
                {project.id}
              </td>
              <td className="px-4 py-2 text-sm text-[var(--text)]">
                {project.name}
              </td>
              <td className="px-4 py-2 text-sm text-[var(--text)]">
                {project.projectTypeKey}
              </td>
              <td className="px-4 py-2 text-sm text-[var(--text)]">
                {project.projectCategory}
              </td>
              <td className="px-4 py-2 text-sm text-[var(--text)]">
                {project.developers?.map((dev) => dev.displayName).join(", ") ||
                  "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
