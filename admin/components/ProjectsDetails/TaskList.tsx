"use client";

import { Task } from "@/types";
import TaskStatusBadge from "./TaskStatusBadge";

export default function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Key
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Summary
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.key} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <TaskStatusBadge status={task.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {task.key}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {task.summary}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
