"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, assignRole } from "@/utils/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUser = () => {
  const router = useRouter();

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
      router.push("/users");
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error("Error registering user or assigning role.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-center bg-white dark:bg-gray-900 px-4 min-h-screen">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-full max-w-xl p-8 bg-white dark:bg-gray-800 rounded-sm shadow-2xl space-y-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Register New User
        </h2>

        {/* Username */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-300">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
            className="w-full px-4 py-3 rounded border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter user's email"
            className="w-full px-4 py-3 rounded border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-300">
            Role
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
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

        {/* Buttons */}
        <div className="flex justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="w-1/2 py-3 rounded bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-1/2 py-3 rounded bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors duration-300"
          >
            Register User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
