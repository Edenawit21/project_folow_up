"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface AddPrivilegeProps {
  onCreate: (data: {
    name: string;
    description: string;
    actions: string;
  }) => void;
  onClose: () => void;
}

export default function AddPrivilege({ onCreate, onClose }: AddPrivilegeProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    actions: "",
  });
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData); // Pass all fields, including actions
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-[500px] ml-64 mt-10 p-6 bg-gray-50 dark:bg-gray-800 rounded-sm shadow-2xl space-y-5 border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Add Privilege
      </h2>

      <div>
        <label
          htmlFor="name"
          className="block mb-1 text-gray-700 dark:text-gray-300"
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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Privilege name"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block mb-1 text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Describe the privilege"
        />
      </div>

      <div>
        <label
          htmlFor="actions"
          className="block mb-1 text-gray-700 dark:text-gray-300"
        >
          Actions (comma separated)
        </label>
        <input
          id="actions"
          name="actions"
          type="text"
          value={formData.actions}
          onChange={handleChange}
          placeholder="e.g. create, read, update, delete"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="w-1/2 px-5 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white rounded transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="w-1/2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
        >
          Create Privilege
        </button>
      </div>
    </form>
  );
}
