"use client";
import { useState, useMemo } from "react";
import { projects } from "@/constants"; 

import {Bell,Search,Menu,X,FolderKanban,UserCircle2,BarChart2,PieChart,LineChart,Home,Clock,Settings,Users,
} from "lucide-react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

import { initialProjects } from "@/constants";
import { Status } from "@/types";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

const getStatusData = () => {
  const statusCount: Record<string, number> = {};
  projects.forEach((p) => {
    statusCount[p.status] = (statusCount[p.status] || 0) + 1;
  });
  return Object.entries(statusCount).map(([status, count]) => ({
    name: status,
    value: count,
  }));
};

const getPriorityData = () => {
  const priorityCount: Record<string, number> = {};
  projects.forEach((p) => {
    priorityCount[p.priority] = (priorityCount[p.priority] || 0) + 1;
  });
  return Object.entries(priorityCount).map(([priority, count]) => ({
    name: priority,
    value: count,
  }));
};

const getDueDateData = () => {
  const monthCount: Record<string, number> = {};
  projects.forEach((p) => {
    const date = new Date(p.dueDate);
    const month = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    monthCount[month] = (monthCount[month] || 0) + 1;
  });

  return Object.entries(monthCount)
    .map(([month, count]) => ({
      month,
      count,
    }))
    .sort(
      (a, b) =>
        new Date(a.month).getTime() - new Date(b.month).getTime()
    );
};

export default function ExecutiveDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
const [activeView, setActiveView] = useState("home");

const navItems = [
  { icon: <Home size={18} />, label: "Home", view: "home" },
  { icon: <FolderKanban size={18} />, label: "Projects", view: "projects" },
  { icon: <Clock size={18} />, label: "Timeline", view: "timeline" },
  { icon: <UserCircle2 size={18} />, label: "Project Manager", view: "projectManager" },
  { icon: <Users size={18} />, label: "Users", view: "users" },
  { icon: <Settings size={18} />, label: "Settings", view: "settings" },
];

const chartItems = [
  { icon: <BarChart2 size={18} />, label: "Bar Chart", view: "bar" },
  { icon: <PieChart size={18} />, label: "Pie Chart", view: "pie" },
  { icon: <LineChart size={18} />, label: "Line Chart", view: "line" },
];

  ];

  // Data Preparation
  const statusCount = initialProjects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusCount).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const totalProjects = initialProjects.length;
  const activeProjects = initialProjects.filter(
    (p) => p.status === Status.WorkInProgress
  ).length;
  const completedProjects = initialProjects.filter(
    (p) => p.status === Status.Completed
  ).length;

  return (
    <div className="flex min-h-screen bg-gray-200">
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 bg-white text-white px-4 py-6 relative`}
      >
        <div className="flex items-center justify-between mb-6">
          {!sidebarCollapsed && (
            <h2 className="text-xl font-bold text-black">Dashboard</h2>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-700 hover:text-blue-500"
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

<nav className="space-y-2 pl-1 mb-6">
  {navItems.map((item, idx) => (
    <button
      key={idx}
      onClick={() => setActiveView(item.view)}
      className="flex items-center gap-2 text-black hover:text-blue-500 font-medium overflow-hidden w-full text-left"
    >
      {item.icon}
      {!sidebarCollapsed && (
        <span className="truncate max-w-[150px]">{item.label}</span>
      )}
    </button>
  ))}
</nav>

            >
              {item.icon}
              {!sidebarCollapsed && (
                <span className="truncate max-w-[150px]">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

<div className="mt-6">
  {!sidebarCollapsed && (
    <h3 className="text-black font-semibold mb-2">Charts</h3>
  )}
  <nav className="space-y-2 pl-1">
    {chartItems.map((item, idx) => (
      <button
        key={idx}
        onClick={() => setActiveView(item.view)}
        className="flex items-center gap-2 text-black hover:text-blue-500 font-medium w-full text-left"
      >
        {item.icon}
        {!sidebarCollapsed && (
          <span className="truncate max-w-[150px]">{item.label}</span>
        )}
      </button>
    ))}
  </nav>
</div>

      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="relative w-48">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search className="absolute right-2 top-2.5 w-5 h-4 text-gray-400" />
          </div>
          <Bell className="w-5 h-5 text-gray-700 hover:text-blue-500 cursor-pointer" />
        </header>

<main className="p-4 bg-white flex-1 space-y-6">
  {activeView === "home" && (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-yellow-400">Total Projects</h2>
        <p className="text-3xl font-bold">{projects.length}</p>
      </div>
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-blue-500">Active Projects</h2>
        <p className="text-3xl font-bold">
          {projects.filter((p) => p.status === "In Progress").length}
        </p>
      </div>
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-green-500">Completed Projects</h2>
        <p className="text-3xl font-bold">
          {projects.filter((p) => p.status === "Completed").length}
        </p>
      </div>
    </div>
  )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
              <div className="bg-white shadow rounded-xl p-6">
                <h2 className="text-xl font-semibold text-yellow-400">
                  Total Projects
                </h2>
<p className="text-3xl font-bold">{totalProjects}</p>

              </div>
              <div className="bg-white shadow rounded-xl p-6">
                <h2 className="text-xl font-semibold text-blue-500">
                  Active Projects
                </h2>
<p className="text-3xl font-bold">{activeProjects}</p>
</div>
<div className="bg-white shadow rounded-xl p-6">
  <h2 className="text-xl font-semibold text-green-500">
    Completed Projects
  </h2>
  <p className="text-3xl font-bold">{completedProjects}</p>
</div>
</div>
)}

{selectedSection === "Bar Chart" && (
  <div className="h-96">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </div>
)}

{selectedSection === "Pie Chart" && (
  <div className="h-96">
    <ResponsiveContainer width="100%" height="100%">
      <RePieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </RePieChart>
    </ResponsiveContainer>
  </div>
)}

                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          )}

{selectedSection === "Line Chart" && (
  <div className="h-96">
    <ResponsiveContainer width="100%" height="100%">
      <ReLineChart data={chartData}>
        {/* Add your XAxis, YAxis, Line, and other necessary chart components here */}
      </ReLineChart>
    </ResponsiveContainer>
  </div>
)}

                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
<Line
  type="monotone"
  dataKey="count"
  stroke="#8884d8"
  strokeWidth={2}
/>

                </ReLineChart>
              </ResponsiveContainer>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
