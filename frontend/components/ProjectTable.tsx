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
<div
  className="p-4"
  style={{
    backgroundColor: "var(--background)",
    color: "var(--text)",
  }}
>
  {/* View buttons */}
  <div className="mb-4 flex gap-3">
    {["table", "board", "timeline", "graph"].map((v) => (
      <button
        key={v}
        onClick={() => setView(v as any)}
        className={`px-4 py-2 rounded font-semibold transition-colors duration-200 ${
          view === v
            ? "bg-blue-600 text-white"
            : "bg-[var(--border)] text-[var(--text)] hover:bg-[var(--muted)]"
        }`}
      >
        {v.charAt(0).toUpperCase() + v.slice(1)}
      </button>
    ))}
  </div>

  {/* --- TABLE VIEW --- */}
  {view === "table" && (
    <table
      className="w-full border-collapse"
      style={{ borderColor: "var(--border)" }}
    >
      <thead
        style={{ backgroundColor: "var(--border)" }}
        className="select-none"
      >
        <tr>
          {[
            "Key",
            "Name",
            "Manager",
            "Risk",
            "Issues Done",
            "In Progress",
            "Total Issues",
            "Story Points Done",
            "Last Synced",
            "Actions",
          ].map((header) => (
            <th
              key={header}
              className="border p-2 font-medium"
              style={{ borderColor: "var(--border)" }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredProjects.map((p) => (
          <tr
            key={p.projectKey}
            className="hover:bg-[var(--border)] transition-colors duration-150"
          >
            <td className="border p-2" style={{ borderColor: "var(--border)" }}>
              {p.projectKey}
            </td>
            <td className="border p-2" style={{ borderColor: "var(--border)" }}>
              {p.projectName}
            </td>
            <td className="border p-2" style={{ borderColor: "var(--border)" }}>
              {p.projectManager}
            </td>
            <td className="border p-2" style={{ borderColor: "var(--border)" }}>
              {p.riskLevel || "Unknown"}
            </td>
            <td className="border p-2" style={{ borderColor: "var(--border)" }}>
              {p.issuesDone}
            </td>
            <td className="border p-2" style={{ borderColor: "var(--border)" }}>
              {p.issuesInProgress}
            </td>
            <td className="border p-2" style={{ borderColor: "var(--border)" }}>
              {p.totalIssues}
            </td>
            <td className="border p-2" style={{ borderColor: "var(--border)" }}>
              {p.storyPointsDone}
            </td>
            <td className="border p-2" style={{ borderColor: "var(--border)" }}>
              {moment(p.lastSyncedAt).format("YYYY-MM-DD")}
            </td>
            <td className="border p-2 text-center relative" style={{ borderColor: "var(--border)" }}>
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

  {/* ...rest of your views (board, timeline, graph) go here... */}
</div>

              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* BOARD VIEW */}
      {viewMode === "board" && (
        <div className="flex gap-6">
          {boardGroups.map((risk) => (
<div
  key={risk}
  className="flex-1 rounded p-4"
  style={{ backgroundColor: "var(--border)" }}
>
  <h3
    className="font-semibold mb-3"
    style={{ color: "var(--text)" }}
  >
    {risk.toUpperCase()}
  </h3>
  {(filteredProjects || projects)
    .filter((p) => p.riskLevel === risk)
    .map((p) => (
      <div key={p.projectKey} className="mb-2">
        {/* Render project info here */}
        {p.projectName}
      </div>
    ))}
</div>

                .filter((p) => p.riskLevel === risk)
                .map((p) => (
                  <div
                    key={p.projectKey}
                    className="rounded shadow-sm p-3 mb-3"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--text)",
                    }}
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
    <p style={{ color: "var(--muted)" }}>
      * Timeline view demo. For a full timeline, use a timeline library
      like react-calendar-timeline or similar.
    </p>
    <ul className="mt-3 space-y-2">
      {timelineData.map((item) => (
        <li
          key={item.id}
          className="border rounded p-2"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
        >
          <strong>{item.title}</strong> - Manager: {item.group} <br />
          Start: {moment(item.start_time).format("YYYY-MM-DD")} | End:{" "}
          {moment(item.end_time).format("YYYY-MM-DD")}
        </li>
      ))}
    </ul>
  </div>
)}

      )}

      {/* GRAPH VIEW */}
      {viewMode === "graph" && (
        <div className="space-y-10">
          <div style={{ width: "100%", height: 300 }}>
<h3
  className="mb-3 font-semibold text-lg"
  style={{ color: "var(--text)" }}
>
  Issues Status Bar Chart
</h3>
<ResponsiveContainer>
  <BarChart data={graphData} margin={{ top: 5, bottom: 30 }}>
    <XAxis
      dataKey="name"
      angle={-45}
      textAnchor="end"
      interval={0}
      stroke="var(--text)"
    />
    <YAxis stroke="var(--text)" />
    <Tooltip
      contentStyle={{
        backgroundColor: "var(--background)",
        color: "var(--text)",
      }}
    />
    <Legend wrapperStyle={{ color: "var(--text)" }} />
    <Bar dataKey="issuesDone" fill="#82ca9d" name="Done" />
    <Bar dataKey="issuesInProgress" fill="#8884d8" name="In Progress" />
    <Bar dataKey="issuesRemaining" fill="#ffc658" name="Remaining" />
  </BarChart>
</ResponsiveContainer>

                <Bar dataKey="issuesDone" fill="#82ca9d" name="Done" />
                <Bar dataKey="issuesInProgress" fill="#8884d8" name="In Progress" />
                <Bar dataKey="issuesRemaining" fill="#ffc658" name="Remaining" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ width: "100%", height: 300 }}>
<h3
  className="mb-3 font-semibold text-lg"
  style={{ color: "var(--text)" }}
>
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
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    color: "var(--text)",
                  }}
                />
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
