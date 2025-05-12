"use client";
import { useState } from "react";
import {Bell,Search,Menu,X,FolderKanban,UserCircle2,BarChart2,PieChart,LineChart,} from "lucide-react";

export default function ExecutiveDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { icon: <FolderKanban size={18} />, label: "Projects", href: "#projects" },
    { icon: <UserCircle2 size={18} />, label: "Project Manager", href: "#project-manager" },
  ];

  const chartItems = [
    { icon: <BarChart2 size={18} />, label: "Bar Chart", href: "#bar-chart" },
    { icon: <PieChart size={18} />, label: "Pie Chart", href: "#pie-chart" },
    { icon: <LineChart size={18} />, label: "Line Chart", href: "#line-chart" },
  ];

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
        <div className="mb-6">
          {!sidebarCollapsed && (
            <h3 className="text-black font-semibold mb-2">Data</h3>
          )}
          <nav className="space-y-2 pl-1">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="flex items-center gap-2 text-black hover:text-blue-500 font-medium overflow-hidden"
              >
                {item.icon}
                {!sidebarCollapsed && (
                  <span className="truncate max-w-[150px]">{item.label}</span>
                )}
              </a>
            ))}
          </nav>
        </div>
        <div>
          {!sidebarCollapsed && (
            <h3 className="text-black font-semibold mb-2">Charts</h3>
          )}
          <nav className="space-y-2 pl-1">
            {chartItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="flex items-center gap-2 text-black hover:text-blue-500 font-medium overflow-hidden"
              >
                {item.icon}
                {!sidebarCollapsed && (
                  <span className="truncate max-w-[150px]">{item.label}</span>
                )}
              </a>
            ))}
          </nav>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-48">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Search className="absolute right-2 top-2.5 w-5 h-4 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <Bell className="w-5 h-5 text-gray-700 hover:text-blue-500 cursor-pointer" />
          </div>
        </header>

        <main className="p-4 bg-white flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-xl font-semibold text-yellow-400">
                Total Projects
              </h2>
              <p className="text-3xl font-bold">32</p>
            </div>
            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-xl font-semibold text-blue-500">
                Active Projects
              </h2>
              <p className="text-3xl font-bold">18</p>
            </div>
            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-xl font-semibold text-green-500">
                Completed Projects
              </h2>
              <p className="text-3xl font-bold">10</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
