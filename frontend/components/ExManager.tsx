"use client";
import { useEffect, useState } from "react";
import {
  Bell,Search,Menu,X,FolderKanban,UserCircle2,BarChart2,PieChart,LineChart,ChevronDown,ChevronUp,
} from "lucide-react";

export default function ExecutiveDashboard() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dataOpen, setDataOpen] = useState(true);
  const [chartsOpen, setChartsOpen] = useState(true);

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
    <div className="flex min-h-screen gap-x-2 bg-gray-200">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-64 bg-gray-100 text-white px-4 py-6">
          <h2 className="text-xl font-bold text-black mb-6">Dashboard</h2>

          {/* Data Section */}
          <div>
            <button
              className="flex items-center justify-between w-full text-black font-semibold mb-2"
              onClick={() => setDataOpen(!dataOpen)}
            >
              <span>Data</span>
              {dataOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {dataOpen && (
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
            )}
          </div>

          {/* Charts Section */}
          <div className="mt-6">
            <button
              className="flex items-center justify-between w-full text-black font-semibold mb-2"
              onClick={() => setChartsOpen(!chartsOpen)}
            >
              <span>Charts</span>
              {chartsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {chartsOpen && (
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
            )}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header with toggle and filters */}
        <header className="bg-gray-100 shadow p-4 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-700 hover:text-blue-500"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Search */}
            <div className="relative w-48">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Search className="absolute right-2 top-2.5 w-5 h-5 text-gray-400" />
            </div>

            {/* Priority */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Status */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-700 hover:text-blue-500 cursor-pointer" />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                {notificationCount}
              </span>
            )}
          </div>
        </header>

        {/* Dashboard Cards */}
        <main className="p-3 bg-gray-200 flex-1">
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
