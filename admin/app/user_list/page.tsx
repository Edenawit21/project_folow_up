"use client";
import { useState, useEffect } from "react";
import UserList from "@/components/UserList";

export default function UserListPage() {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  if (!token) return <div>Please login first.</div>;

  return <UserList role="Director" token={token} />;
}
