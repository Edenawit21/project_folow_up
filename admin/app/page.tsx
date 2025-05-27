"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to login if token doesn't exist
      router.push("/login");
    }
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Admin Page</h1>
    </div>
  );
};

export default Page;
