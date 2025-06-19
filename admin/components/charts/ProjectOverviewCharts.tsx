// src/components/charts/ProjectOverviewCharts.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard } from 'lucide-react';
import Card from '@/components/ProjectsDetails/Card';

interface ProjectOverviewChartsProps {
  issueTypeCounts: { [type: string]: number };
  tasksStatusCounts?: { [status: string]: number };
}

const ProjectOverviewCharts: React.FC<ProjectOverviewChartsProps> = ({
  issueTypeCounts,
  tasksStatusCounts = {}
}) => {
  const issueTypeData = Object.keys(issueTypeCounts).map(type => ({
    name: type,
    count: issueTypeCounts[type]
  }));

  const taskStatusData = Object.keys(tasksStatusCounts).map(status => ({
    name: status,
    value: tasksStatusCounts[status]
  }));

  const COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#6B7280', '#60A5FA'];

  const hasIssueTypeData = Object.keys(issueTypeCounts).length > 0;
  const hasTaskStatusData = Object.keys(tasksStatusCounts).length > 0;

  return (
    // FIX: Ensure the 'return' is immediately followed by '(' or the JSX tag.
    // Moved the comment inside the Card's children or just removed it if it was temporary.
    <Card title="Project Overview Analytics" icon={LayoutDashboard}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">

        {/* Column for Issue Type Distribution Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Issue Type Distribution</h3>
          {hasIssueTypeData ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={issueTypeData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4B5563" className="rounded-lg" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
              No issue type data available.
            </div>
          )}
        </div>

        {/* Column for Task Status Breakdown Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Task Status Breakdown</h3>
          {hasTaskStatusData ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
              No task status data available.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProjectOverviewCharts;