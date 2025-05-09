"use client";
import { useEffect, useState } from "react";
import {Bell,Search,Menu,X,FolderKanban,UserCircle2,BarChart2,PieChart,LineChart} from "lucide-react";

export default function ExecutiveDashboard() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        setNotificationCount(data.count || 0);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-200">
      {sidebarOpen && (
        <aside className="w-64 bg-gray-100 text-white px-4 py-6 relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black">Dashboard</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-700 hover:text-blue-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-black font-semibold mb-2">Data</h3>
            <nav className="space-y-2 pl-2">
              <a
                href="#projects"
                className="flex items-center gap-2 text-black hover:text-blue-500 font-medium"
              >
                <FolderKanban size={18} /> Projects
              </a>
              <a
                href="#project-manager"
                className="flex items-center gap-2 text-black hover:text-blue-500 font-medium"
              >
                <UserCircle2 size={18} /> Project Manager
              </a>
            </nav>
          </div>

          <div>
            <h3 className="text-black font-semibold mb-2">Charts</h3>
            <nav className="space-y-2 pl-2">
              <a
                href="#bar-chart"
                className="flex items-center gap-2 text-black hover:text-blue-500 font-medium"
              >
                <BarChart2 size={18} /> Bar Chart
              </a>
              <a
                href="#pie-chart"
                className="flex items-center gap-2 text-black hover:text-blue-500 font-medium"
              >
                <PieChart size={18} /> Pie Chart
              </a>
              <a
                href="#line-chart"
                className="flex items-center gap-2 text-black hover:text-blue-500 font-medium"
              >
                <LineChart size={18} /> Line Chart
              </a>
            </nav>
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-100 shadow p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-700 hover:text-blue-500"
              >
                <Menu size={24} />
              </button>
            )}

            {/* Left-aligned Search Bar */}
            <div className="relative w-48">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Search className="absolute right-2 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <Bell className="w-4 h-4 text-gray-700 hover:text-blue-500 cursor-pointer" />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                {notificationCount}
              </span>
            )}
          </div>
        </header>

        <main className="p-4 bg-gray-200 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-xl font-semibold text-yellow-400">Total Projects</h2>
              <p className="text-3xl font-bold">32</p>
            </div>
            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-xl font-semibold text-blue-500">Active Projects</h2>
              <p className="text-3xl font-bold">18</p>
            </div>
            <div className="bg-white shadow rounded-xl p-6">
              <h2 className="text-xl font-semibold text-green-500">Completed Projects</h2>
              <p className="text-3xl font-bold">10</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
