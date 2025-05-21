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
      className={`flex flex-col h-full bg-[var(--background)] text-[var(--text)] border-r border-[var(--border)] transition-all duration-300 shadow-lg ${
        isSidebarCollapsed ? "w-16" : "w-64"
      } top-0 left-0 z-50`}
      aria-label="Sidebar Navigation"
    >
      <nav className="flex-1 overflow-y-auto px-1 py-4 mt-15 ">
        {[
          { href: "/", icon: Home, label: "Home" },
          { href: "/projects", icon: FolderKanban, label: "Projects" },
          {
            href: "/project-managers",
            icon: UserCircle2,
            label: "Project Managers",
          },
          { href: "/timeline", icon: Briefcase, label: "Timeline" },
          { href: "/search", icon: Search, label: "Search" },
          { href: "/settings", icon: Settings, label: "Settings" },
          { href: "/users", icon: User, label: "Users" },
          { href: "/teams", icon: Users, label: "Teams" },
          { href: "/chat", icon: MessageCircle, label: "Chat" },
        ].map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isCollapsed={isSidebarCollapsed}
            active={pathname === item.href}
          />
        ))}
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
        hover:bg-gray-300 hover:text-blue-600
        ${active ? "font-medium text-blue-700" : ""}
      `}
      aria-current={active ? "page" : undefined}
    >
      <Icon
        className={`h-5 w-5 ${
          active
            ? "text-blue-700"
            : "group-hover:text-blue-600 text-[var(--text)]"
        }`}
      />
      {!isCollapsed && <span>{label}</span>}
      {active && !isCollapsed && (
        <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
      )}
    </Link>
  );
};

export default SideBar;
