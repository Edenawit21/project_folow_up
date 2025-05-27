// app/page.tsx (or app/home/page.tsx if it's nested)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirect if no token
    } else {
      setIsAuthenticated(true);
      setChecking(false); // Stop loading once checked
    }
  }, [router]);

  if (checking) return <div>Checking authentication...</div>;

  if (!isAuthenticated) return null;

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
    </div>
  );
}
