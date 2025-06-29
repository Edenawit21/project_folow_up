// src/components/sprint/TeamWorkloadTable.tsx
import React from "react";
import { Users } from "lucide-react";
import Card from "@/components/ProjectsDetails/Card";
import Table from "@/components/ProjectsDetails/Table";
import { DeveloperWorkload } from "@/types/sprint";

interface TeamWorkloadTableProps {
  developerWorkloads: DeveloperWorkload[];
}

const TeamWorkloadTable: React.FC<TeamWorkloadTableProps> = ({
  developerWorkloads,
}) => {
  const headers = [
    "Developer",
    "Estimated Work",
    "Completed Work",
    "Completion (%)",
    "Status Breakdown",
  ];

  const renderRow = (dev: DeveloperWorkload, index: number) => (
    <tr
      key={index}
      className="dark:hover:bg-gray-800 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
        {dev.assigneeName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
        {(dev.estimatedWork ?? 0).toFixed(1)} SPs/Hours
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
        {(dev.completedWork ?? 0).toFixed(1)} SPs/Hours
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
        {((dev.estimatedWork ?? 0) > 0
          ? ((dev.completedWork ?? 0) / (dev.estimatedWork ?? 1)) * 100
          : 0
        ).toFixed(0)}
        %
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
        {Object.keys(dev.taskStatusBreakdown).map((status) => (
          <span
            key={status}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 mr-2 mb-1"
          >
            {status}: {dev.taskStatusBreakdown[status]}
          </span>
        ))}
      </td>
    </tr>
  );

  return (
    <Card title="Team Workload" icon={Users}>
      <Table<DeveloperWorkload>
        headers={headers}
        data={developerWorkloads}
        renderRow={renderRow}
        emptyMessage="No developer workload data available."
      />
    </Card>
  );
};

export default TeamWorkloadTable;
