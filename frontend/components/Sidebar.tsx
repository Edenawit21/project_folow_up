"use client";

import React from "react";
import {
  Home,
  FolderKanban,
  UserCircle2,
  Briefcase,
  Search,
  Settings,
  User,
  Users,
  MessageCircle,
  PieChart,
  BarChart3,
  LineChart,
} from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/app/redux";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const pathname = usePathname();
  const user = useAppSelector((state) => state.user);

  return (
    <aside
      className={`flex flex-col h-full bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl
        transition-all duration-300 ${
          isSidebarCollapsed ? "w-16" : "w-64"
        } top-0 left-0 z-50`}
      aria-label="Sidebar Navigation"
    >
      {/* Navigation section */}
      <nav className="flex-1 overflow-y-auto px-1 py-4 mt-20">
        <SidebarLink
          icon={Home}
          label="Home"
          href="/"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/"}
        />
        <SidebarLink
          icon={FolderKanban}
          label="Projects"
          href="/projects"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/projects"}
        />
        <SidebarLink
          icon={UserCircle2}
          label="Project Managers"
          href="/project-managers"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/project-managers"}
        />
        <SidebarLink
          icon={Briefcase}
          label="Timeline"
          href="/timeline"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/timeline"}
        />
        <SidebarLink
          icon={Search}
          label="Search"
          href="/search"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/search"}
        />
        <SidebarLink
          icon={Settings}
          label="Settings"
          href="/settings"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/settings"}
        />
        <SidebarLink
          icon={User}
          label="Users"
          href="/users"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/users"}
        />
        <SidebarLink
          icon={Users}
          label="Teams"
          href="/teams"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/teams"}
        />
        <SidebarLink
          icon={MessageCircle}
          label="Chat"
          href="/chat"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/chat"}
        />

        {/* Analytics Section */}
        <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
          <h3
            className={`mb-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 ${
              isSidebarCollapsed ? "sr-only" : ""
            }`}
          >
            Analytics
          </h3>
          <SidebarLink
            icon={PieChart}
            label="Pie Chart"
            href="/charts/pie"
            isCollapsed={isSidebarCollapsed}
            active={pathname === "/charts/pie"}
          />
          <SidebarLink
            icon={BarChart3}
            label="Bar Chart"
            href="/charts/bar"
            isCollapsed={isSidebarCollapsed}
            active={pathname === "/charts/bar"}
          />
          <SidebarLink
            icon={LineChart}
            label="Line Chart"
            href="/charts/line"
            isCollapsed={isSidebarCollapsed}
            active={pathname === "/charts/line"}
          />
        </div>
      </nav>

      {/* User Section */}
      {!isSidebarCollapsed && user.loggedIn && (
        <div className="p-4 flex items-center gap-2 border-t border-gray-200 dark:border-gray-800">
          <img
            src={user.avatar}
            className="w-8 h-8 rounded-full border dark:border-gray-600"
            alt="User avatar"
          />
          <span className="text-sm text-gray-700 dark:text-gray-100">
            {user.name}
          </span>
        </div>
      )}
    </aside>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  isCollapsed: boolean;
  active: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
  active,
}: SidebarLinkProps) => {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors
        ${
          active
            ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium"
            : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-800"
        }`}
      aria-current={active ? "page" : undefined}
    >
      <Icon
        className={`h-5 w-5 ${
          active
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"
        }`}
      />
      {!isCollapsed && <span className="text-base">{label}</span>}
      {active && !isCollapsed && (
        <div className="ml-auto h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
      )}
    </Link>
  );
};

export default SideBar;
