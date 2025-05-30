"use client";

import React, { useState } from "react";
import { registerUser, assignRole } from "@/utils/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUser = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    privilege: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.role ||
      !form.privilege
    ) {
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
      setForm({
        username: "",
        email: "",
        password: "",
        role: "",
        privilege: "",
      });
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error("Error registering user or assigning role.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-white dark:bg-gray-900 px-4 min-h-screen border border-gray-200 dark:border-gray-700">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-md shadow-lg space-y-6"
      >
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
            autoComplete="off"
            placeholder="Enter username"
            className="w-full px-4 py-3 rounded-[1px] border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
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
            autoComplete="new-email"
            placeholder="Enter user's email"
            className="w-full px-4 py-3 rounded-[1px] border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
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
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-[1px] border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Role and Privilege in one row */}
        <div className="flex gap-4">
          {/* Role */}
          <div className="flex-1">
            <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-300 cursor-pointer">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-[1px] border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
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

          {/* Privilege */}
          <div className="flex-1">
            <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-300 cursor-pointer">
              Privilege
            </label>
            <select
              name="privilege"
              value={form.privilege}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-[1px] border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            >
              <option value="" disabled>
                Select a privilege
              </option>
              <option value="Read">Read</option>
              <option value="Write">Write</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-[1px] bg-green-600 hover:bg-green-700 text-white font-bold text-lg transition-colors duration-300"
        >
          Register User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
