"use client";

import React, { useState } from "react";

const AddUser = () => {
  const [form, setForm] = useState({
    name: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.role) {
      alert("Please fill in all fields.");
      return;
    }

    console.log("Submitting:", form);

    // Add API or Redux submission logic here
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-xl bg-[var(--background)] border border-[var(--border)]">
      <h2 className="text-3xl font-semibold mb-6 text-[var(--foreground)] text-center">
        Add User
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--foreground)]">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
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

        {/* Role Dropdown */}
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
            <option value="Executive Manager">Executive Manager</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Team Leader">Team Leader</option>
            <option value="Project Owner">Project Owner</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
