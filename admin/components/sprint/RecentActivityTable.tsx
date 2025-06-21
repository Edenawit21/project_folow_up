// src/components/sprint/RecentActivityTable.tsx
import React from "react";
import { Activity } from "lucide-react";
import Card from "@/components/ProjectsDetails/Card";
import Table from "@/components/ProjectsDetails/Table";
import { formatDateTime } from "@/utils/sprintApi";
import { RecentActivity } from "../../types/sprint";

interface RecentActivityTableProps {
  recentActivities: RecentActivity[];
}

const RecentActivityTable: React.FC<RecentActivityTableProps> = ({
  recentActivities,
}) => {
  const headers = ["Timestamp", "Task Key", "Description", "Changed By"];

  const renderRow = (activity: RecentActivity, index: number) => (
    <tr
      key={index}
      className="dark:hover:bg-gray-800 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
        {formatDateTime(activity.timestamp)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400">
        {activity.taskKey}
      </td>
      <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 dark:text-gray-300 max-w-xs">
        {activity.description}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
        {activity.changedBy ?? "N/A"}
      </td>
    </tr>
  );

  return (
    <Card title="Recent Activity Log" icon={Activity}>
      <Table<RecentActivity>
        headers={headers}
        data={recentActivities}
        renderRow={renderRow}
        emptyMessage="No recent activity data available for this sprint."
      />
    </Card>
  );
};

export default RecentActivityTable;
