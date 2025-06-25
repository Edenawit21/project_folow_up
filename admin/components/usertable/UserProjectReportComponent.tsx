import React, { useEffect, useState } from "react";
import BreakdownCard from "./BreakdownCard";
import MetricCard from "./MetricsCard";
import { TasksTable } from "../sprint/TaskTable";
import { UserProjectReport, TaskStatus } from "../../types/userReport";
import { TaskInSprint } from "@/types/sprint";
import { fetchUserProjectReport } from "../../utils/userReportApi";

interface UserProjectReportProps {
  data: UserProjectReport;
  loading: boolean;
  userId: string;
  projectId: string;
}

const UserProjectReportComponent: React.FC<UserProjectReportProps> = ({
  userId,
  projectId,
}) => {
  const [reportData, setReportData] = useState<UserProjectReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [displayedTasks, setDisplayedTasks] = useState<TaskInSprint[]>([]);

  useEffect(() => {
    const getReport = async () => {
      setLoading(true);
      setError(null);
      setReportData(null);
      setDisplayedTasks([]);

      if (!userId || !projectId) {
        setError("User ID or Project ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchUserProjectReport(userId, projectId);
        setReportData(data);
        setDisplayedTasks(data.userTasksInProject || []);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching the report.");
      } finally {
        setLoading(false);
      }
    };

    getReport();
  }, [userId, projectId]);

  useEffect(() => {
    if (!reportData || !reportData.userTasksInProject) {
      setDisplayedTasks([]);
      return;
    }

    const filtered = reportData.userTasksInProject.filter((task) => {
      const matchesStatus =
        filterStatus === "All" || task.status === filterStatus;
      const matchesSearch =
        searchTerm === "" ||
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });

    setDisplayedTasks(filtered);
  }, [filterStatus, searchTerm, reportData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-800">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Loading report data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-800">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg font-semibold">
            Error: {error}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            Please ensure your backend API is running and accessible.
          </p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          No report data available.
        </p>
      </div>
    );
  }

  const {
    userName,
    projectName,
    totalTasksAssigned,
    completedTasks,
    totalStoryPointsAssigned,
    completedStoryPoints,
    overdueTasks,
    activeBlockers,
    taskCompletionPercentage,
    storyPointCompletionPercentage,
    taskStatusCounts,
    issueTypeCounts,
    priorityCounts,
    sprintsInvolvedIn,
  } = reportData;

  return (
    <div className="min-h-screen dark:bg-gray-800 px-4 py-6 sm:px-6 lg:px-8">
      <div className="dark:bg-gray-800 rounded-xl  p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {userName}'s Report for {projectName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Detailed performance breakdown and task summary.
          </p>
        </header>

        {/* Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
          <MetricCard
            title="Total Tasks Assigned"
            value={totalTasksAssigned}
            color="blue"
            percentage={0}
          />
          <MetricCard
            title="Completed Tasks"
            value={completedTasks}
            percentage={taskCompletionPercentage}
            color="green"
          />
          <MetricCard
            title="Total Story Points"
            value={totalStoryPointsAssigned}
            color="purple"
            percentage={0}
          />
          <MetricCard
            title="Completed Story Points"
            value={completedStoryPoints}
            percentage={storyPointCompletionPercentage}
            color="teal"
          />
          <MetricCard
            title="Overdue Tasks"
            value={overdueTasks}
            color="red"
            percentage={0}
          />
          <MetricCard
            title="Active Blockers"
            value={activeBlockers}
            color="orange"
            percentage={0}
          />
        </section>

        {/* Sprint Badges */}
        {sprintsInvolvedIn?.length > 0 && (
          <section className="dark:bg-gray-700 p-4 rounded-lg mb-8 ">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Sprints Involved In
            </h2>
            <div className="flex flex-wrap gap-2">
              {sprintsInvolvedIn.map((sprint) => (
                <span
                  key={sprint.id}
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    sprint.state === "active"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      : sprint.state === "closed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                  }`}
                >
                  {sprint.name} ({sprint.state})
                </span>
              ))}
            </div>
          </section>
        )}
        {/* Breakdown Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <BreakdownCard
            title="Task Status Breakdown"
            counts={taskStatusCounts}
          />
          <BreakdownCard
            title="Issue Type Breakdown"
            counts={issueTypeCounts}
          />
          <BreakdownCard title="Priority Breakdown" counts={priorityCounts} />
        </section>

        {/* Filters */}
        <section className="dark:bg-gray-800 p-6 rounded-lg mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search tasks (Key, Title, Description)"
            className="w-full sm:flex-1 p-2 text-gray-800 dark:text-white dark:bg-gray-800  focus:ring-indigo-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-56 p-2 rounded-md text-gray-800 dark:text-white  dark:bg-gray-800 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            {Object.values(TaskStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setFilterStatus("All");
              setSearchTerm("");
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Reset
          </button>
        </section>

        {/* Tasks Table */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Filtered Tasks ({displayedTasks.length})
          </h2>
          {displayedTasks.length > 0 ? (
            <div className="rounded-lg overflow-x-auto w-full">
              <div className="min-w-full">
                <TasksTable tasks={displayedTasks} />
              </div>
            </div>
          ) : (
            <div className="dark:bg-gray-800 p-6 text-center text-gray-600 dark:text-gray-400 rounded-lg">
              No tasks match your search/filter criteria.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserProjectReportComponent;
