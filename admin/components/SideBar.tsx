"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/utils";
import { UserPlus, Users, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-40 bg-[var(--background)] shadow-lg 
        overflow-hidden transition-[width] duration-500 ease-in-out
        ${isSidebarCollapsed ? "w-0" : "w-64"}
      `}
    >
      {!isSidebarCollapsed && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <Image src="/logo.png" alt="Logo" width={40} height={50} />
            <button
              onClick={() => dispatch(setIsSidebarCollapsed(true))}
              aria-label="Collapse Sidebar"
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Menu className="w-5 h-5 text-[var(--foreground)]" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <SidebarLink icon={UserPlus} label="Add User" href="/add_user" />
            <SidebarLink icon={Users} label="User List" href="/user_list" />
          </nav>
        </div>
      )}
    </aside>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="block">
      <div
        className={`relative flex items-center gap-3 px-5 py-2 rounded-lg transition-all
          ${
            isActive
              ? "bg-blue-100 dark:bg-gray-700 text-blue-700"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-[var(--foreground)]"
          }`}
      >
        {isActive && (
          <span className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-sm" />
        )}
        <Icon className="w-5 h-5" />
        <span className="text-xl font-medium">{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;
