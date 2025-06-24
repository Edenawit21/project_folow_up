"use client";
import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import {
  LayoutDashboard,
  List,
  Users,
  Activity,
  PieChart,
  ClipboardList,
  Gauge,
  BarChart2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const navItems = [
    { id: "sprint-summary-section", title: "Sprint Summary", icon: ClipboardList },
    { id: "sprint-metrics-section", title: "Sprint Metrics", icon: Gauge },
    { id: "priority-breakdown-section", title: "Priorities", icon: BarChart2 },
    { id: "project-charts-section", title: "Overview Analytics", icon: PieChart },
    { id: "tasks-table-section", title: "Tasks in Sprint", icon: List },
    { id: "team-workload-section", title: "Team Workload", icon: Users },
    { id: "recent-activity-section", title: "Recent Activity", icon: Activity },
  ];

  return (
    <div className="min-h-screen dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-0 font-inter">
      <div className="max-w-6xl mx-auto px-4 md:px-0 -mt-8">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => router.push("/dashboard/projects")}
            className="text-xl font-medium text-blue-600 hover:underline flex items-center"
          >
            ← Back to Projects
          </button>
        </div>
        <header className="dark:bg-gray-800 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 rounded-lg shadow-md">
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

        {/* Changed flex-wrap to flex-nowrap to ensure single row */}
        <div className="flex flex-nowrap gap-2 mb-6 justify-start">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className="flex flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-md py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors duration-200 cursor-pointer"
            >
              {item.icon && React.createElement(item.icon, { className: "h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" })}
              {item.title}
            </Link>
          ))}
        </div>

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
              <div id="sprint-summary-section" className="lg:col-span-1">
                <SprintSummaryCard report={sprintReport} />
              </div>

              <div id="sprint-metrics-section" className="lg:col-span-1">
                <SprintMetricsCard report={sprintReport} />
              </div>

              <div id="priority-breakdown-section" className="lg:col-span-1">
                <PriorityBreakdownCard priorityCounts={priorityCounts} />
              </div>

              <div id="project-charts-section" className="lg:col-span-1">
                <ProjectOverviewCharts
                  issueTypeCounts={sprintReport.issueTypeCounts}
                  tasksStatusCounts={sprintReport.taskStatusCounts}
                />
              </div>

              <div id="tasks-table-section" className="lg:col-span-2">
                <TasksTable tasks={sprintReport.tasksInSprint} />
              </div>

              <div id="team-workload-section" className="lg:col-span-2">
                <TeamWorkloadTable
                  developerWorkloads={sprintReport.developerWorkloads || []}
                />
              </div>

              <div id="recent-activity-section" className="lg:col-span-2">
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