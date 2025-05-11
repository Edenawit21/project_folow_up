"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/utils/auth";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem("visited");
    if (!visited) {
      localStorage.setItem("visited", "true");
      setIsFirstVisit(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      router.push("/manager");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  
  

  return (
    <div className="min-h-screen flex flex-col  font-sans text-black dark:bg-gray-900 dark:text-white ">

      <div className="flex flex-1">
        
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
              {isFirstVisit ? "Welcome!" : "Welcome Back!"}
            </h2>
            <p className="text-sm text-gray-500 text-center mb-4">
              Enter your credentials below
            </p>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
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

              <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{" "}
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
