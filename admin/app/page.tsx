"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /login
    router.push("/login");
  }, [router]);

  return null;
};

export default Page;
