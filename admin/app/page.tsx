"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode"; // fixed import

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);

      const rolesClaim =
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      const roles = decoded[rolesClaim];

      const normalizedRoles = Array.isArray(roles)
        ? roles.map((r) => r.toLowerCase())
        : [String(roles).toLowerCase()];

      if (!normalizedRoles.includes("admin")) {
        router.push("/login");
        return;
      }

      setLoading(false);
    } catch (err) {
      console.error("Invalid token:", err);
      router.push("/login");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="p-4 text-lg text-gray-900 dark:text-gray-100">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 text-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 min-h-screen">
      <h1>Welcome to the Admin Page</h1>
    </div>
  );
};

export default Page;
