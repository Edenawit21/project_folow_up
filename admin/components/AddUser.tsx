"use client";

import React, { useState } from "react";
import { registerUser, assignRole } from "@/utils/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUser = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.role) {
      toast.warn("Please fill in all fields.");
      return;
    }

    try {
      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      await assignRole({
        username: form.username,
        role: form.role,
      });

      toast.success("User registered and role assigned!");
      setForm({ username: "", email: "", password: "", role: "" });
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error("Error registering user or assigning role.");
    }
  };

  return (
    <>
      <div className="w-full max-w-xl mx-auto mt-20 px-8 py-10 rounded-2xl shadow-2xl border bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <h2 className="text-center text-4xl font-bold mb-10 text-gray-900 dark:text-gray-100">
          Create New User
        </h2>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
          {/* Username */}
          <div>
            <label className="block mb-1 font-semibold text-sm text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="off"
              placeholder="e.g. johndoe"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold text-sm text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="new-email"
              placeholder="user@example.com"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-semibold text-sm text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 font-semibold text-sm text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="Admin">Admin</option>
              <option value="Director">Director</option>
              <option value="ProjectManager">Project Manager</option>
              <option value="TeamLeader">Team Leader</option>
              <option value="ProjectOwner">Project Owner</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-colors"
          >
            Register User
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AddUser;
