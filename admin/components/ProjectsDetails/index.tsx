"use client";

import React, { useState, useEffect } from "react";
import ProjectHeader from "@/components/ProjectsDetails/ProjectHeader";
import HealthCard from "@/components/ProjectsDetails/HealthCard";
import ProgressCard from "@/components/ui/Project/ProgressCard";
import BlockersCard from "@/components/ui/Project/BlockersCard";
import CompletionCard from "@/components/ui/Project/CompletionCard";
import ActiveTasksCard from "@/components/ui/Project/ActiveTasksCard";
import PriorityCard from "@/components/ui/Project/PriorityCard";
import StatusDistributionCard from "@/components/ui/Project/StatusDistributionCard";
import { ProjectDto, fetchProjectById } from "@/utils/Jira";
import { TaskDto, fetchTasksByProject } from "@/utils/task";

export default function ProjectDetail({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [projectData, tasksData] = await Promise.all([
          fetchProjectById(projectId),
          fetchTasksByProject(projectId),
        ]);
        console.log("Project Data:", projectData);

        setProject(projectData);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (isLoading || !project) {
    return (
      <div className="grid grid-cols-1 gap-6 p-6 bg-white dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse h-32"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse h-48"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate metrics from tasks
  const statusCounts = calculateStatusDistribution(tasks);
  const priorityCounts = calculatePriorityDistribution(tasks);
  const completionPercentage = calculateCompletion(tasks);
  const activeTasksCount = statusCounts["InProgress"] || 0;
  const overdueTasksCount = countOverdueTasks(tasks);

  const handleBack = () => {
    // Navigation logic
  };

  const handleEdit = () => {
    // Edit logic
  };

  return (
    <div className="grid grid-cols-1 gap-6 p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ProjectHeader
        project={project}
        onBack={handleBack}
        onEdit={handleEdit}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HealthCard health={project.Health} isLoading={isLoading} />
        <ProgressCard
          progress={{
            totalTasks: project.Progress.TotalTasks,
            completedTasks: project.Progress.CompletedTasks,
            storyPointsCompleted: project.Progress.StoryPointsCompleted,
            storyPointsTotal: project.Progress.StoryPointsTotal,
          }}
          isLoading={isLoading}
        />
        <BlockersCard
          activeBlockers={project.Progress.ActiveBlockers}
          recentUpdates={project.Progress.RecentUpdates}
          overdueTasks={overdueTasksCount}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CompletionCard
          completionPercentage={completionPercentage}
          isLoading={isLoading}
        />
        <ActiveTasksCard
          activeTasksCount={activeTasksCount}
          isLoading={isLoading}
        />
        <PriorityCard priorityCounts={priorityCounts} isLoading={isLoading} />
      </div>

      <StatusDistributionCard
        statusCounts={statusCounts}
        isLoading={isLoading}
      />
    </div>
  );
}

function calculateStatusDistribution(tasks: TaskDto[]): Record<string, number> {
  return tasks.reduce((acc, task) => {
    acc[task.Status] = (acc[task.Status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function calculatePriorityDistribution(
  tasks: TaskDto[]
): Record<string, number> {
  return tasks.reduce((acc, task) => {
    const priority = task.Priority?.trim().toLowerCase() || "unspecified";
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function calculateCompletion(tasks: TaskDto[]): number {
  const total = tasks.length;
  const done = tasks.filter((t) => t.Status === "Done").length;
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

function countOverdueTasks(tasks: TaskDto[]): number {
  const today = new Date();
  return tasks.filter((t) => {
    if (!t.DueDate) return false;
    const dueDate = new Date(t.DueDate);
    return dueDate < today && t.Status !== "Done";
  }).length;
}
