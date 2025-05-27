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

      toast.success("User successfully registered and role assigned!");
      setForm({ username: "", email: "", password: "", role: "" });
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error("Error registering user or assigning role.");
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-xl bg-[var(--background)] border border-[var(--border)]">
        <h2 className="text-3xl font-semibold mb-6 text-[var(--foreground)] text-center">
          Add User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-[var(--border)] bg-transparent text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition cursor-pointer"
          >
            Add User
          </button>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AddUser;
