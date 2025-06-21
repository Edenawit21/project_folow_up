"use client";
import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  SprintReport,
  ProjectSprintOverviewResponse,
  SprintReportDetail,
  TaskInSprint,
} from "@/types/sprint";

import { fetchApi, fetchSprint } from "@/utils/sprintApi";
import LoadingSpinner from "@/components/ProjectsDetails/LoadingSpinner";
import ErrorAlert from "@/components/ProjectsDetails/ErrorAlert";
import ProjectOverviewCharts from "@/components/charts/ProjectOverviewCharts";
import SprintSummaryCard from "@/components/sprint/SprintSummaryCard";
import SprintMetricsCard from "@/components/sprint/SprintMetricsCard";
import TeamWorkloadTable from "@/components/sprint/TeamWorkloadTable";
import RecentActivityTable from "@/components/sprint/RecentActivityTable";
import { TasksTable } from "../sprint/TaskTable";
import PriorityBreakdownCard from "@/components/sprint/PriorityBreakdownChart";

interface ProjectDetailProps {
  projectKey: string;
}

const ProjectDetail: NextPage<ProjectDetailProps> = ({ projectKey }) => {
  const router = useRouter();
  const [sprintReport, setSprintReport] = useState<SprintReportDetail | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [priorityCounts, setPriorityCounts] = useState<{
    [key: string]: number;
  }>({});

  const [availableSprints, setAvailableSprints] = useState<SprintReport[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const projectOverviewData: ProjectSprintOverviewResponse =
          await fetchApi(projectKey);
        setProjectName(projectOverviewData.projectName);

        if (projectOverviewData.sprints?.length > 0) {
          setAvailableSprints(projectOverviewData.sprints);

          let selected =
            projectOverviewData.sprints.find((s) => s.state === "active") ||
            projectOverviewData.sprints.find((s) => s.state === "closed") ||
            projectOverviewData.sprints[0];

          selected
            ? setSelectedSprintId(selected.id)
            : setError(`No sprints found for project with key: ${projectKey}`);
        } else {
          setError(`No sprints found for project with key: ${projectKey}`);
        }
      } catch (err: any) {
        console.error("Error fetching project overview:", err);
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectKey]);

  useEffect(() => {
    const fetchSelectedSprintDetails = async () => {
      if (!selectedSprintId) return;

      setLoading(true);
      setError(null);

      try {
        const sprintDetail = await fetchSprint(selectedSprintId);

        const priorityCount: { [key: string]: number } = {};
        sprintDetail.tasksInSprint?.forEach((task: TaskInSprint) => {
          const priority = task.priority || "N/A";
          priorityCount[priority] = (priorityCount[priority] || 0) + 1;
        });

        setPriorityCounts(priorityCount);

        setSprintReport({
          ...sprintDetail,
          taskStatusCounts: sprintDetail.taskStatusCounts || {},
          issueTypeCounts: sprintDetail.issueTypeCounts || {},
          developerWorkloads: sprintDetail.developerWorkloads || [],
          recentActivities: sprintDetail.recentActivities || [],
        });
      } catch (err: any) {
        console.error(`Error fetching sprint details:`, err);
        setError(err.message || "Failed to fetch sprint details.");
        setSprintReport(null);
        setPriorityCounts({});
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedSprintDetails();
  }, [selectedSprintId]);

  const handleSprintChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSprintId(event.target.value);
  };

  const displayProjectName = projectName || projectKey;

  return (
    <div className="min-h-screen dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-6 font-inter">
      {/* Back Button at the very top-left */}
      <div className="max-w-6xl mx-auto px-4 md:px-0">
        <button
          onClick={() => router.push("/dashboard/projects")}
          className="text-xl font-medium text-blue-600 hover:underline flex items-center mb-4"
        >
          ← Back to Projects
        </button>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="dark:bg-gray-800 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 w-full">
            <h1 className="text-2xl font-semibold flex items-center text-violet-700 mt-2 md:mt-0">
              <LayoutDashboard className="h-6 w-6 text-blue-500 mr-2" />
              Project Dashboard:
              <span className="ml-2 font-bold">{displayProjectName}</span>
            </h1>
          </div>

          {availableSprints.length > 0 && (
            <div className="flex items-center gap-2">
              <label
                htmlFor="sprint-select"
                className="text-sm font-medium text-green-500"
              >
                Select Sprint:
              </label>
              <select
                id="sprint-select"
                value={selectedSprintId || ""}
                onChange={handleSprintChange}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {availableSprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name} ({sprint.state})
                  </option>
                ))}
              </select>
            </div>
          )}
        </header>

        {/* Status Messages */}
        <main>
          {loading && <LoadingSpinner />}
          {error && <ErrorAlert message={error} />}

          {!loading && !error && !sprintReport && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 text-lg">
              {availableSprints.length === 0
                ? `No sprints found for project with key: ${projectKey}.`
                : "Select a sprint to view its report."}
            </div>
          )}

          {/* Main Dashboard */}
          {sprintReport && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SprintSummaryCard report={sprintReport} />
              <SprintMetricsCard report={sprintReport} />

              <PriorityBreakdownCard priorityCounts={priorityCounts} />
              <ProjectOverviewCharts
                issueTypeCounts={sprintReport.issueTypeCounts}
                tasksStatusCounts={sprintReport.taskStatusCounts}
              />

              <div className="lg:col-span-2">
                <TasksTable tasks={sprintReport.tasksInSprint} />
              </div>

              <div className="lg:col-span-2">
                <TeamWorkloadTable
                  developerWorkloads={sprintReport.developerWorkloads || []}
                />
              </div>

              <div className="lg:col-span-2">
                <RecentActivityTable
                  recentActivities={sprintReport.recentActivities || []}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;
