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
  X,
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
    fixed flex flex-col h-full justify-between z-40 overflow-y-auto shadow-xl
    transition-all duration-300
    bg-[var(--background)]
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
  `;

  return (
    <div className={sidebarClassNames}>
      <div className="flex flex-col h-full w-full justify-start">
        {/* Logo Header */}
        <div className="z-50 flex items-center min-h-[56px] justify-between px-6 py-4 border-b border-[var(--border)]">
          <button
            className="p-1 hover:opacity-70"
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            aria-label="Collapse Sidebar"
          >
            <Menu className="h-6 w-6 text-[var(--text)] hover:text-gray-500 bg-[var(--background)] cursor-pointer" />
          </button>
        </div>

        {/* Team Section */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-[var(--border)] cursor-pointer">
          <Image src="/logo.png" alt="Logo" width={36} height={36} />
          
         <h1>Project Tracker</h1>
        </div>

        {/* Navigation Links */}
        <nav className="z-10 w-full">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={Briefcase} label="projects" href="/projects" />
          <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
        </nav>
      </div>
    </div>
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
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 && {
          isActive ? "bg-gray-100 text-white dark:bg-gray-600" : ""
        } justify-start px-8 py-3`}
      >
        $
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200" />
        )}
        <Icon className="h-6 w-6 text-[var(--text)]" />
        <span className="text-[var(--text)] font-medium text-2xl">{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;
