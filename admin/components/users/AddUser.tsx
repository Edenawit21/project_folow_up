"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserForm } from "@/types";
import { registerUser, updateUser } from "@/utils/userApi";

interface AddUserProps {
  userId?: string;
  initialData?: Partial<UserForm>;
}

const AddUser: React.FC<AddUserProps> = ({ userId, initialData }) => {
  const router = useRouter();

  const [form, setForm] = useState<UserForm>({
    username: "",
    email: "",
    password: "",
    roles: [""],
    ...initialData,
  });

  const isEditMode = Boolean(userId);

  useEffect(() => {
    if (isEditMode && initialData) {
      setForm((prev) => ({
        ...prev,
        ...initialData,
        password: "", // Clear password field on edit
      }));
    }
  }, [initialData, isEditMode]);

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
      (!form.password && !isEditMode) ||
      !form.roles
    ) {
      toast.warn("Please fill in all required fields.");
      return;
    }

    try {
      if (isEditMode) {
        const updateData: Partial<UserForm> = {
          email: form.email,
          roles: form.roles,
        };
        if (form.password) {
          updateData.password = form.password;
        }

        await updateUser(userId!, updateData);
        toast.success("User updated successfully!");
      } else {
        await registerUser(form);
        toast.success("User registered successfully!");
      }

      router.push("/users/user_list");
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-center bg-white dark:bg-gray-900 px-4 min-h-screen mt-10">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-full max-w-xl p-8 bg-white dark:bg-gray-800 rounded-sm shadow-2xl space-y-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {isEditMode ? "Edit User" : "Register New User"}
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
            disabled={isEditMode}
            required
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
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-300">
            Password {isEditMode ? "(leave blank to keep current)" : ""}
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={isEditMode ? "••••••••" : "Enter password"}
            className="w-full px-4 py-3 rounded border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            {...(!isEditMode && { required: true })}
          />
        </div>

        {/* Role */}
        <div>
          <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-300">
            Role
          </label>
          <select
            name="role"
            value={form.roles}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition cursor-pointer"
            required
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
            {isEditMode ? "Update User" : "Register User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
