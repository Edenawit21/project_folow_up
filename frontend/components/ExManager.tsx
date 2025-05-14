"use client";

import { useState } from "react";
import { projects } from "@/constants"; // Make sure `projects` is exported from `constants/index.ts`

import {
  Bell,
  Search,
  Menu,
  X,
  FolderKanban,
  UserCircle2,
  BarChart2,
  PieChart,
  LineChart,
  Home,
  Clock,
  Settings,
  Users,
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
} from "recharts";

// Color palette
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

const getStatusData = () => {
  const statusCount: Record<string, number> = {};
  projects.forEach((p) => {
    statusCount[p.status] = (statusCount[p.status] || 0) + 1;
  });
  return Object.entries(statusCount).map(([status, value]) => ({
    name: status,
    value,
  }));
};

const getPriorityData = () => {
  const priorityCount: Record<string, number> = {};
  projects.forEach((p) => {
    priorityCount[p.priority] = (priorityCount[p.priority] || 0) + 1;
  });
  return Object.entries(priorityCount).map(([name, value]) => ({
    name,
    value,
  }));
};

const getDueDateData = () => {
  const monthCount: Record<string, number> = {};
  projects.forEach((p) => {
    const month = new Date(p.dueDate).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    monthCount[month] = (monthCount[month] || 0) + 1;
  });
  return Object.entries(monthCount)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
};

export default function ExecutiveDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navItems = [
    { icon: <Home size={18} />, label: "Home", section: "home" },
    { icon: <FolderKanban size={18} />, label: "Projects", section: "projects" },
    { icon: <Clock size={18} />, label: "Timeline", section: "timeline" },
    { icon: <UserCircle2 size={18} />, label: "Project Manager", section: "project-manager" },
    { icon: <Users size={18} />, label: "Users", section: "users" },
    { icon: <Settings size={18} />, label: "Settings", section: "settings" },
  ];

  const chartItems = [
    { icon: <BarChart2 size={18} />, label: "Bar Chart", section: "bar-chart" },
    { icon: <PieChart size={18} />, label: "Pie Chart", section: "pie-chart" },
    { icon: <LineChart size={18} />, label: "Line Chart", section: "line-chart" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-200">
      {/* Sidebar */}
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

        {/* Navigation */}
        <nav className="space-y-2 pl-1">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSection(item.section)}
              className="flex items-center gap-2 text-black hover:text-blue-500 font-medium overflow-hidden w-full text-left"
            >
              {item.icon}
              {!sidebarCollapsed && (
                <span className="truncate max-w-[150px]">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Charts */}
        <div className="mt-6">
          {!sidebarCollapsed && (
            <h3 className="text-black font-semibold mb-2">Charts</h3>
          )}
          <nav className="space-y-2 pl-1">
            {chartItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSection(item.section)}
                className="flex items-center gap-2 text-black hover:text-blue-500 font-medium overflow-hidden w-full text-left"
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

      {/* Main Content */}
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
          {activeSection === "home" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
                <div className="bg-white shadow rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-yellow-400">
                    Total Projects
                  </h2>
                  <p className="text-3xl font-bold">{projects.length}</p>
                </div>
                <div className="bg-white shadow rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-blue-500">
                    Active Projects
                  </h2>
                  <p className="text-3xl font-bold">
                    {projects.filter((p) => p.status === "In Progress").length}
                  </p>
                </div>
                <div className="bg-white shadow rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-green-500">
                    Completed Projects
                  </h2>
                  <p className="text-3xl font-bold">
                    {projects.filter((p) => p.status === "Completed").length}
                  </p>
                </div>
              </div>
            </>
          )}

          {activeSection === "pie-chart" && (
            <div className="bg-white shadow rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-2">Project Status Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RePieChart>
                  <Pie
                    data={getStatusData()}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {getStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeSection === "bar-chart" && (
            <div className="bg-white shadow rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-2">Project Priority Count</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ReBarChart data={getPriorityData()}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeSection === "line-chart" && (
            <div className="bg-white shadow rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-2">Projects Due Over Time</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ReLineChart data={getDueDateData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
