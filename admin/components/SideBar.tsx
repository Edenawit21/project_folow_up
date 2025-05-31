"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/utils";
import {
  Menu,
  User,
  Briefcase,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Key,
  UserPlus,
  Users,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-40 shadow-lg transition-[width] duration-500 ease-in-out
        bg-white text-gray-900 border-r border-gray-200
        dark:bg-gray-900 dark:text-white dark:border-gray-700
        ${isSidebarCollapsed ? "w-0" : "w-64"}
      `}
    >
      {!isSidebarCollapsed && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <Image src="/logo.png" alt="Logo" width={40} height={50} />
            <button
              onClick={() => dispatch(setIsSidebarCollapsed(true))}
              aria-label="Collapse Sidebar"
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {/* <SidebarLink
              icon={UserPlus}
              label="AddUsers"
              href="/users/add_user"
            /> */}
            <SidebarLink icon={Users} label="Users" href="/users/user_list" />

            <SidebarLink
              icon={Briefcase}
              label="Projects"
              href="/projects/project_list"
            />
            <SidebarLink icon={Key} label="Roles" href="/roles/role_list" />
            <SidebarLink
              icon={ShieldCheck}
              label="Privileges"
              href="/privileges/privilege_list"
            />
          </nav>
        </div>
      )}
    </aside>
  );
};

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="block">
      <div
        className={`relative flex items-center gap-3 px-5 py-2 rounded-lg transition-all
          ${
            isActive
              ? "bg-blue-100 text-blue-700 dark:bg-gray-800"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
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

const SidebarMenu = ({
  icon: Icon,
  label,
  items,
}: {
  icon: React.ElementType;
  label: string;
  items: SidebarLinkProps[];
}) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(
    items.some((item) => pathname === item.href)
  );

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-5 py-2 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="text-xl font-medium">{label}</span>
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {open && (
        <div className="ml-10 mt-2 space-y-2">
          {items.map((item) => (
            <SidebarLinkSmall key={item.href} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarLinkSmall = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="block">
      <div
        className={`relative flex items-center gap-2 px-3 py-1 rounded-md transition-all text-sm
          ${
            isActive
              ? "bg-blue-100 text-blue-700 dark:bg-gray-800"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </div>
    </Link>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

export default Sidebar;
