"use client";
import { FolderKanban, Key, Layers, User, Users, Crown } from "lucide-react";
import Link from "next/link";
import { Project } from "@/types";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-200 to-blue-100 dark:from-blue-800 dark:to-blue-700">
          <FolderKanban
            className="text-blue-700 dark:text-blue-200"
            size={24}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {project.name}
          </h2>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            <Key className="mr-1" size={12} />
            {project.key}
          </div>
        </div>
      </div>

      <div className="mb-2 text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <Layers size={14} className="text-blue-500" />
        <span>{project.projectTypeKey}</span>
      </div>

      <div className="mb-2 text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
        <Layers size={14} className="text-green-500" />
        <span>{project.projectCategory}</span>
      </div>

      <div className="mb-2 text-sm flex items-center gap-2 text-purple-600 dark:text-purple-300">
        <User size={14} />
        <span>{project.leadDisplayName}</span>
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200 mb-1">
          <Users size={14} className="text-indigo-500" />
          <span className="font-semibold">
            {project.admins.length + project.developers.length} team member
            {project.admins.length + project.developers.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {project.admins.map((admin, index) => (
            <span
              key={`admin-${index}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs font-medium"
            >
              <Crown size={12} />
              {admin.displayName}
            </span>
          ))}
          {project.developers.map((dev, index) => (
            <span
              key={`dev-${index}`}
              className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 text-xs font-medium"
            >
              {dev.displayName}
            </span>
          ))}
        </div>
      </div>

      <div className="text-right">
        <Link
          href={`/projects/${project.key.toUpperCase()}`}
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          → View details
        </Link>
      </div>
    </div>
  );
}
