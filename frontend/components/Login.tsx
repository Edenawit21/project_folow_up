"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem("visited");
    if (!visited) {
      localStorage.setItem("visited", "true");
      setIsFirstVisit(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to signup page (as placeholder for login logic)
    router.push("/projects");
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
    >
      <div className="flex flex-1">
        <main className="flex-1 flex items-center justify-center px-4">
          <div
            className="max-w-md w-full p-8 rounded-xl shadow-lg"
            style={{
              backgroundColor: "var(--background)", // Updated form background
              border: "1px solid var(--border)",
            }}
          >
            <h2 className="text-2xl font-bold text-center mb-2">
              {isFirstVisit ? "Welcome!" : "Welcome Back!"}
            </h2>
            <p
              className="text-sm text-center mb-4"
              style={{ color: "var(--muted)" }}
            >
              Enter your credentials below
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text)",
                    backgroundColor: "var(--background)",
                  }}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text)",
                    backgroundColor: "var(--background)",
                  }}
                  className="mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Link
                  href="#"
                  className="absolute bottom-2 right-4 text-blue-600 hover:underline text-sm"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm"
              >
                Log In
              </button>

              <p
                className="text-center text-sm mt-4"
                style={{ color: "var(--muted)" }}
              >
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;
