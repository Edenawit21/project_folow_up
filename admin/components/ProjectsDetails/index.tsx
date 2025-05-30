"use client";

import { Project } from "@/types";
import { Task } from "@/types";
import TaskList from "./TaskList";
import { FolderKanban } from "lucide-react";
import Link from "next/link";

// Add proper type guards
function isProject(project: any): project is Project {
  return !!project?.key && !!project?.name;
}

function areTasks(tasks: any): tasks is Task[] {
  return Array.isArray(tasks);
}

export default function ProjectDetail({
  project,
  tasks,
}: {
  project: Project;
  tasks: Task[];
}) {
  if (!isProject(project) || !areTasks(tasks)) {
    console.error("Invalid props:", { project, tasks });
    return (
      <div className="p-6 text-red-500">
        Invalid project data received
        <Link href="/projects" className="block mt-4 text-blue-600">
          ← Back to Projects
        </Link>
      </div>
    );
  }
  {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FolderKanban className="text-blue-600" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{project.projectName}</h1>
            <p className="text-gray-500">{project.key}</p>
          </div>
        </div>

        <TaskList tasks={tasks} />

        <div className="mt-4">
          <Link
            href="/projects"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }
}