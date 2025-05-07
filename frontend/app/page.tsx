"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login"); // Redirect to /login
  }, [router]);

  return null; // Or show a loading spinner
};

export default Page;
