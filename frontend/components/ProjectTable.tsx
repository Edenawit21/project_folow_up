"use client";

import React, { useState } from "react";
import { Project } from "@/types";
import moment from "moment";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ProjectDashboardProps {
  projects: Project[];
}

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ProjectDashboard({ projects }: ProjectDashboardProps) {
  const [view, setView] = useState<"table" | "board" | "timeline" | "graph">(
    "table"
  );

  
  const timelineData = projects.map((p) => ({
    id: p.projectKey,
    group: p.projectManager,
    title: p.projectName,
    start_time: moment(p.lastSyncedAt).subtract(30, "days").valueOf(),
    end_time: moment(p.lastSyncedAt).valueOf(),
  }));

  // --- Board grouping by risk level ---
  const boardGroups = Array.from(
    new Set(projects.map((p) => p.riskLevel || "Unknown"))
  );

  // --- Data for graph: Issue status summary ---
  const graphData = projects.map((p) => ({
    name: p.projectName,
    issuesDone: p.issuesDone,
    issuesInProgress: p.issuesInProgress,
    issuesRemaining: p.totalIssues - p.issuesDone - p.issuesInProgress,
  }));

  // --- Pie chart data for risk level distribution ---
  const riskCount = boardGroups.map((risk) => ({
    name: risk,
    value: projects.filter((p) => p.riskLevel === risk).length,
  }));

  return (
    <div>
      {/* View buttons */}
      <div className="mb-4 flex gap-3">
        {["table", "board", "timeline", "graph"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v as any)}
            className={`px-4 py-2 rounded ${
              view === v
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* --- TABLE VIEW --- */}
      {view === "table" && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Key</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Manager</th>
              <th className="border border-gray-300 p-2">Risk</th>
              <th className="border border-gray-300 p-2">Issues Done</th>
              <th className="border border-gray-300 p-2">In Progress</th>
              <th className="border border-gray-300 p-2">Total Issues</th>
              <th className="border border-gray-300 p-2">Story Points Done</th>
              <th className="border border-gray-300 p-2">Last Synced</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.projectKey} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{p.projectKey}</td>
                <td className="border border-gray-300 p-2">{p.projectName}</td>
                <td className="border border-gray-300 p-2">
                  {p.projectManager}
                </td>
                <td className="border border-gray-300 p-2">{p.riskLevel}</td>
                <td className="border border-gray-300 p-2">{p.issuesDone}</td>
                <td className="border border-gray-300 p-2">
                  {p.issuesInProgress}
                </td>
                <td className="border border-gray-300 p-2">{p.totalIssues}</td>
                <td className="border border-gray-300 p-2">
                  {p.storyPointsDone}
                </td>
                <td className="border border-gray-300 p-2">{p.lastSyncedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* --- BOARD VIEW --- */}
      {view === "board" && (
        <div className="flex gap-6">
          {boardGroups.map((risk) => (
            <div key={risk} className="flex-1 bg-gray-100 rounded p-4">
              <h3 className="font-semibold mb-3">{risk.toUpperCase()}</h3>
              {projects
                .filter((p) => p.riskLevel === risk)
                .map((p) => (
                  <div
                    key={p.projectKey}
                    className="bg-white p-3 mb-3 rounded shadow-sm"
                  >
                    <strong>{p.projectName}</strong>
                    <div>Manager: {p.projectManager}</div>
                    <div>
                      Issues: {p.issuesDone}/{p.totalIssues}
                    </div>
                    <div>
                      Story Points: {p.storyPointsDone}/{p.totalStoryPoint}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}

      {/* --- TIMELINE VIEW --- */}
      {view === "timeline" && (
        <div>
          <p>
            * Timeline view demo. For a full timeline, use a timeline library
            like react-calendar-timeline or similar.
          </p>
          <ul className="mt-3 space-y-2">
            {timelineData.map((item) => (
              <li key={item.id} className="border p-2 rounded">
                <strong>{item.title}</strong> - Manager: {item.group} <br />
                Start: {moment(item.start_time).format("YYYY-MM-DD")} | End:{" "}
                {moment(item.end_time).format("YYYY-MM-DD")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- GRAPH VIEW --- */}
      {view === "graph" && (
        <div className="space-y-10">
          <div style={{ width: "100%", height: 300 }}>
            <h3 className="mb-3 font-semibold text-lg">
              Issues Status Bar Chart
            </h3>
            <ResponsiveContainer>
              <BarChart data={graphData} margin={{ top: 5, bottom: 30 }}>
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="issuesDone" fill="#82ca9d" name="Done" />
                <Bar
                  dataKey="issuesInProgress"
                  fill="#8884d8"
                  name="In Progress"
                />
                <Bar
                  dataKey="issuesRemaining"
                  fill="#ffc658"
                  name="Remaining"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ width: "100%", height: 300 }}>
            <h3 className="mb-3 font-semibold text-lg">
              Risk Level Distribution
            </h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={riskCount}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {riskCount.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
