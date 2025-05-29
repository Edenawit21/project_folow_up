"use client";

import React from "react";
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
  projects?: Project[];
  onEdit: (updatedProject: Project) => void;
  onDelete: (projectKey: string) => void;
  viewMode: "table" | "board" | "timeline" | "graph";
  filters?: {
    riskLevel?: string;
  };
}

const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ProjectDashboard({
  projects = [],
  onEdit,
  onDelete,
  viewMode,
  filters = { riskLevel: "" },
}: ProjectDashboardProps) {
  const filteredProjects = filters.riskLevel
    ? projects.filter((p) => p.riskLevel === filters.riskLevel)
    : projects;

  const timelineData = filteredProjects.map((p) => ({
    id: p.projectKey,
    group: p.projectManager,
    title: p.projectName,
    start_time: moment(p.lastSyncedAt).subtract(30, "days").valueOf(),
    end_time: moment(p.lastSyncedAt).valueOf(),
  }));

  const boardGroups = Array.from(
    new Set(filteredProjects.map((p) => p.riskLevel || "Unknown"))
  );

  const graphData = filteredProjects.map((p) => ({
    name: p.projectName,
    issuesDone: p.issuesDone,
    issuesInProgress: p.issuesInProgress,
    issuesRemaining: Math.max(0, p.totalIssues - p.issuesDone - p.issuesInProgress),
  }));

  const riskCount = boardGroups.map((risk) => ({
    name: risk,
    value: filteredProjects.filter((p) => p.riskLevel === risk).length,
  }));

  return (
    <div>
      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="p-2 border">Key</th>
              <th className="p-2 border">Project title</th>
              <th className="p-2 border">Project Manager</th>
              <th className="p-2 border">Risk</th>
              <th className="p-2 border">Done</th>
              <th className="p-2 border">In Progress</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Story Points</th>
              <th className="p-2 border">Last Synced</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((p) => (
              <tr key={p.projectKey} className="hover:bg-gray-50 text-sm">
                <td className="p-2 border">{p.projectKey}</td>
                <td className="p-2 border">{p.projectName}</td>
                <td className="p-2 border">{p.projectManager}</td>
                <td className="p-2 border">{p.riskLevel || "N/A"}</td>
                <td className="p-2 border">{p.issuesDone}</td>
                <td className="p-2 border">{p.issuesInProgress}</td>
                <td className="p-2 border">{p.totalIssues}</td>
                <td className="p-2 border">{p.storyPointsDone}</td>
                <td className="p-2 border">
                  {moment(p.lastSyncedAt).format("YYYY-MM-DD")}
                </td>
                <td className="p-2 border text-center relative">
                  <ActionMenu
                    onEdit={() => onEdit(p)}
                    onDelete={() => onDelete(p.projectKey)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* BOARD VIEW */}
      {viewMode === "board" && (
        <div className="flex gap-6">
          {boardGroups.map((risk) => (
            <div key={risk} className="flex-1 bg-gray-100 rounded p-4">
              <h3 className="font-semibold mb-3">{risk.toUpperCase()}</h3>
              {filteredProjects
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

      {/* TIMELINE VIEW */}
      {viewMode === "timeline" && (
        <ul className="mt-3 space-y-2">
          {timelineData.map((item) => (
            <li key={item.id} className="border p-2 rounded">
              <strong>{item.title}</strong> - Manager: {item.group}
              <br />
              Start: {moment(item.start_time).format("YYYY-MM-DD")} | End:{" "}
              {moment(item.end_time).format("YYYY-MM-DD")}
            </li>
          ))}
        </ul>
      )}

      {/* GRAPH VIEW */}
      {viewMode === "graph" && (
        <div className="space-y-10">
          <div style={{ width: "100%", height: 300 }}>
            <h3 className="mb-3 font-semibold text-lg">Issues Status Bar Chart</h3>
            <ResponsiveContainer>
              <BarChart data={graphData} margin={{ top: 5, bottom: 30 }}>
                <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="issuesDone" fill="#82ca9d" name="Done" />
                <Bar dataKey="issuesInProgress" fill="#8884d8" name="In Progress" />
                <Bar dataKey="issuesRemaining" fill="#ffc658" name="Remaining" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ width: "100%", height: 300 }}>
            <h3 className="mb-3 font-semibold text-lg">Risk Level Distribution</h3>
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
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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

function ActionMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1 rounded hover:bg-gray-200"
        aria-label="Actions menu"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 4a2 2 0 110-4 2 2 0 010 4zm0 4a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-24 rounded-md shadow-lg bg-white ring-1 ring-white ring-opacity-5 z-10">
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
