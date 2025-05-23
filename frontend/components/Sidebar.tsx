"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/utils";
import {
  Briefcase,
  Home,
  LucideIcon,
  Menu,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const sidebarClassNames = `
    fixed top-0 left-0 h-full z-40 flex flex-col justify-between overflow-y-auto
    transition-all duration-300 ease-in-out shadow-xl
    bg-[var(--background)]
    ${isSidebarCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-64"}
  `;

  return (
    <aside className={sidebarClassNames}>
      <div className="flex flex-col h-full w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          {/* Collapse Button */}
          <button
            className="p-1 hover:opacity-70"
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            aria-label="Collapse Sidebar"
          >
            <Menu className="h-6 w-6 text-[var(--text)] cursor-pointer" />
          </button>

          {/* Logo */}
          <Image src="/logo.png" alt="Logo" width={40} height={50} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={Briefcase} label="Projects" href="/projects" />
          <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
        </nav>
      </div>
    </aside>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href === "/" && pathname === "/dashboard");

  return (
    <Link href={href} className="block w-full">
      <div
        className={`relative flex items-center gap-4 px-6 py-3 rounded-md transition-colors duration-200 
          ${
            isActive
              ? "bg-blue-100 dark:bg-gray-700 text-blue-700"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--text)]"
          }`}
      >
        {isActive && (
          <span className="absolute left-0 h-full w-1 bg-blue-500 rounded-r" />
        )}
        <Icon className="h-6 w-6" />
        <span className="text-xl font-medium">{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;
