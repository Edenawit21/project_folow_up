import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Project } from "@/types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface ChartProps {
  projects: Project[];
}

export const PieChartComponent = ({ projects }: ChartProps) => {
  const statusChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, value]) => ({
      name: status,
      value,
    }));
  }, [projects]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-center mb-4">
        Project Status Overview
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={statusChartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={100}
            dataKey="value"
          >
            {statusChartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChartComponent = ({ projects }: ChartProps) => {
  const priorityChartData = useMemo(() => {
    const counts: Record<string, number> = { High: 0, Medium: 0, Low: 0 };
    projects.forEach((p) => {
      counts[p.priority] += 1;
    });
    return Object.entries(counts).map(([priority, count]) => ({
      priority,
      count,
    }));
  }, [projects]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-center mb-4">
        Project Priority Count
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={priorityChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="priority" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
