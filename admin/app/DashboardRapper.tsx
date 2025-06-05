"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/NavBar";
import Sidebar from "@/components/SideBar";
import { store, persistor, useAppSelector } from "./redux";

const HIDDEN_LAYOUT_ROUTES = ["/login"];

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useAppSelector((state) => state.global.isLoggedIn);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoggedIn && pathname !== "/login") {
      router.replace("/login");
    }
  }, [isLoggedIn, pathname, router]);

  if (!isLoggedIn && pathname !== "/login") {
    // Prevent showing protected content before redirect
    return null;
  }

  return <>{children}</>;
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const pathname = usePathname();

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  if (HIDDEN_LAYOUT_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-gray-900">
      <Sidebar />
      <main
        className={`flex w-full flex-col ${isSidebarCollapsed ? "" : "md:pl-64"}`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading app state...</div>} persistor={persistor}>
        <AuthGuard>
          <DashboardLayout>{children}</DashboardLayout>
        </AuthGuard>
      </PersistGate>
    </Provider>
  );
}
