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

  return (
    <aside
      className={`flex flex-col h-full bg-[var(--background)] text-[var(--foreground)] border-[var(--border-color)] shadow-xl transition-all duration-300 ${
        isSidebarCollapsed ? "w-16" : "w-64"
      } top-0 left-0 z-50`}
      aria-label="Sidebar Navigation"
    >
      <nav className="flex-1 overflow-y-auto px-1 py-4 mt-15">
        <SidebarLink
          href="/"
          icon={Home}
          label="Home"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/"}
        />
        <SidebarLink
          href="/projects"
          icon={FolderKanban}
          label="Projects"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/projects"}
        />
        <SidebarLink
          href="/project-managers"
          icon={UserCircle2}
          label="Project Managers"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/project-managers"}
        />
        <SidebarLink
          href="/timeline"
          icon={Briefcase}
          label="Timeline"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/timeline"}
        />
        <SidebarLink
          href="/search"
          icon={Search}
          label="Search"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/search"}
        />
        <SidebarLink
          href="/settings"
          icon={Settings}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/settings"}
        />
        <SidebarLink
          href="/users"
          icon={User}
          label="Users"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/users"}
        />
        <SidebarLink
          href="/teams"
          icon={Users}
          label="Teams"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/teams"}
        />
        <SidebarLink
          href="/chat"
          icon={MessageCircle}
          label="Chat"
          isCollapsed={isSidebarCollapsed}
          active={pathname === "/chat"}
        />

        <div className="mt-6  dark:border-gray-800 pt-4">
          <h3
            className={`mb-3 px-4 text-xs font-semibold uppercase tracking-wide ${
              isSidebarCollapsed ? "sr-only" : ""
            }`}
          >
            Analytics
          </h3>
          <SidebarLink
            href="/charts/pie"
            icon={PieChart}
            label="Pie Chart"
            isCollapsed={isSidebarCollapsed}
            active={pathname === "/charts/pie"}
          />
          <SidebarLink
            href="/charts/bar"
            icon={BarChart3}
            label="Bar Chart"
            isCollapsed={isSidebarCollapsed}
            active={pathname === "/charts/bar"}
          />
          <SidebarLink
            href="/charts/line"
            icon={LineChart}
            label="Line Chart"
            isCollapsed={isSidebarCollapsed}
            active={pathname === "/charts/line"}
          />
        </div>
      </nav>
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
        hover:bg-blue-200 dark:hover:bg-gray-800 ${
          active
            ? "bg-blue-100 font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
            : ""
        }`}
      aria-current={active ? "page" : undefined}
    >
      <Icon
        className={`h-5 w-5 ${
          active
            ? "text-blue-600 dark:text-blue-400"
            : "group-hover:text-blue-700 dark:group-hover:text-gray-200"
        }`}
      />
      {!isCollapsed && <span>{label}</span>}
      {active && !isCollapsed && (
        <div className="ml-auto h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
      )}
    </Link>
  );
};

export default SideBar;
