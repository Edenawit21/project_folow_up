"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

const AddPrivilege: React.FC = () => {
  const [form, setForm] = useState({
    privilageName: "",
    description: "",
    action: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { privilageName, description, action } = form;

    if (!privilageName || !action) {
      toast.warn("Privilege name and action are required.");
      return;
    }

    // TODO: Replace with actual API call
    console.log("Submitting privilege:", form);
    toast.success("Privilege added (mock)");

    setForm({ privilageName: "", description: "", action: "" });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Add Privilege
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            Privilege Name
          </label>
          <input
            name="privilageName"
            value={form.privilageName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-[1px] dark:bg-gray-700 dark:text-white"
            placeholder="Enter privilege name"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            Action
          </label>
          <input
            name="action"
            value={form.action}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-[1px] dark:bg-gray-700 dark:text-white"
            placeholder="e.g., View, Edit, Delete"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-[1px] dark:bg-gray-700 dark:text-white"
            rows={3}
            placeholder="Optional description"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-[1px] font-semibold"
        >
          Add Privilege
        </button>
      </form>
    </div>
  );
};

export default AddPrivilege;
