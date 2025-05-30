"use client";

import React, { useState } from "react";

type FormState = {
  username: string;
  password: string;
};

const Login = () => {
  const [form, setForm] = useState<FormState>({ username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted form data:", form);
    alert(`Logged in as: ${form.username}`);
    // No backend call, no validation, just UI.
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-10 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm shadow-sm p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-4 py-2 border rounded-sm bg-white dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-sm bg-white dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="  w-full py-2 rounded-md bg-green-700 hover:bg-green-800 text-white font-semibold transition-colors duration-200 border border-transparent hover:border-gray-900 dark:hover:border-white focus:outline-none focus:ring-2 focus:ring-green-500
  "
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
