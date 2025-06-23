// src/components/sprint/SprintSummaryCard.tsx
import React from "react";
import { LayoutDashboard, Calendar, Goal } from "lucide-react";
import Card from "@/components/ProjectsDetails/Card";
import { formatDate, getProgressColor } from "@/utils/sprintApi";
import { SprintReport, SprintReportDetail } from "@/types/sprint";

interface SprintSummaryCardProps {
  report: SprintReportDetail;
}

const SprintSummaryCard: React.FC<SprintSummaryCardProps> = ({ report }) => {
  // Add a fallback for the report object to prevent further errors if it's undefined
  const {
    name,
    startDate,
    endDate,
    state,
    boardName,
    goal,
    storyPointCompletionPercentage,
    taskCompletionPercentage,
  } = report || {};

  const statusColor =
    state === "active"
      ? "bg-green-100 text-green-700"
      : state === "closed"
      ? "bg-gray-100 text-gray-700"
      : "bg-blue-100 text-blue-700";

  return (
    <Card title={`Sprint Summary: ${name || "N/A"}`} icon={LayoutDashboard}>
      <div className="mb-4 text-gray-700 dark:text-gray-300">
        <p className="flex items-center mb-2">
          <Calendar className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
          <span className="font-semibold">Dates:</span>&nbsp;
          {startDate ? formatDate(startDate) : "N/A"} -{" "}
          {endDate ? formatDate(endDate) : "N/A"}
        </p>

        {state && (
          <p className="flex items-center mb-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold
              ${
                state === "active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : state === "closed"
                  ? "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              }`}
            >
              {state.charAt(0).toUpperCase() + state.slice(1)}
            </span>
          </p>
        )}

        {goal && (
          <p className="flex items-start mt-2 text-gray-600 dark:text-gray-400">
            <Goal className="h-5 w-5 mt-1 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <span className="font-semibold">Goal:</span>
            <span className="ml-1 italic">{goal}</span>
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Completion Progress
          </h3>

          {/* Story Points Progress */}
          <div className="mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Story Points: {(storyPointCompletionPercentage || 0).toFixed(0)}%
              Completed
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getProgressColor(
                  storyPointCompletionPercentage || 0
                )}`}
                style={{ width: `${storyPointCompletionPercentage || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Task Completion Progress */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Tasks: {(taskCompletionPercentage || 0).toFixed(0)}% Completed
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getProgressColor(
                  taskCompletionPercentage || 0
                )}`}
                style={{ width: `${taskCompletionPercentage || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SprintSummaryCard;
