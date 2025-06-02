"use client";

import React, { useState } from "react";

interface AddPrivilegeProps {
  onCreate: (data: { name: string; description: string }) => void;
  onClose: () => void;
}

export default function AddPrivilege({ onCreate, onClose }: AddPrivilegeProps) {
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[500px] p-4 bg-white dark:bg-gray-800 rounded-sm shadow space-y-4 ml-64 mt-10 "
    >
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Add Privilege
      </h2>

      <div>
        <label
          htmlFor="name"
          className="block text-gray-700 dark:text-gray-300 mb-1"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Privilege name"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-gray-700 dark:text-gray-300 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Describe the privilege"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Privilege
        </button>
      </div>
    </form>
  );
}
