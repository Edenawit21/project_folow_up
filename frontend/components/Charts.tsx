"use client"; // This should be at the very top

import React, { useMemo } from "react";
import { ChartProps } from "@/types";
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
import { useTheme } from "next-themes";
import { Project } from "@/types";
// Use Heroicons v2 imports
import {
  InformationCircleIcon,
  Bars3Icon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];


export const PieChartComponent = ({ projects }: ChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
    <div className="rounded-lg shadow p-6 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4">
        <InformationCircleIcon className="h-5 w-5 text-gray-900 dark:text-white" />
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Project Status Overview
        </h2>
      </div>
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
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#f9f9f9",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              color: isDark ? "#fff" : "#000",
            }}
            labelStyle={{ color: isDark ? "#fff" : "#000" }}
            itemStyle={{ color: isDark ? "#fff" : "#000" }}
            wrapperStyle={{ zIndex: 10 }}
          />
          <Legend
            wrapperStyle={{
              color: isDark ? "#fff" : "#000",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChartComponent = ({ projects }: ChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
    <div className="rounded-lg shadow p-6 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Bars3Icon className="h-5 w-5 text-gray-900 dark:text-white" />
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white">
          Project Priority Count
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={priorityChartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? "#4B5563" : "#ccc"}
            strokeOpacity={0.3}
          />
          <XAxis
            dataKey="priority"
            stroke={isDark ? "#fff" : "#000"}
            tick={{ fill: isDark ? "#fff" : "#000" }}
          />
          <YAxis
            allowDecimals={false}
            stroke={isDark ? "#fff" : "#000"}
            tick={{ fill: isDark ? "#fff" : "#000" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#f9f9f9",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
              color: isDark ? "#fff" : "#000",
            }}
            labelStyle={{ color: isDark ? "#fff" : "#000" }}
            itemStyle={{ color: isDark ? "#fff" : "#000" }}
            wrapperStyle={{ zIndex: 10 }}
          />
          <Legend
            wrapperStyle={{
              color: isDark ? "#fff" : "#000",
            }}
          />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
