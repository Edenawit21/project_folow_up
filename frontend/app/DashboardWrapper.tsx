"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div
      className={`flex min-h-screen w-full bg-[var(--background)] text-[var(--text)]`}
    >
      <Sidebar />
      <main
        className={`flex w-full flex-col transition-padding duration-300 ease-in-out border-[var(--border)] ${
          isSidebarCollapsed ? "" : "md:pl-64"
        } bg-[var(--background)] text-[var(--text)]`}
      >
        <Navbar />
        <div className="flex-grow">{children}</div>
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
