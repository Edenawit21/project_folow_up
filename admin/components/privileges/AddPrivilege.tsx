"use client";

import React, { useState } from "react";
import { PrivilegePayload } from "@/types/privilege";
import { createPermission } from "@/utils/privilegeApi";
import { toast } from "react-toastify";

interface AddPrivilegeProps {
  onClose: () => void;
  onCreate?: (data: PrivilegePayload) => void;
}

const AddPrivilege: React.FC<AddPrivilegeProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState<PrivilegePayload>({
    permissionName: "",
    description: "",
    action: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createPermission(formData);
      toast.success("Privilege created successfully!");
      onCreate?.(formData);
      onClose();
    } catch {
      toast.error("Failed to create privilege.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[500px] p-6 bg-white dark:bg-gray-800 rounded shadow border border-gray-300 dark:border-gray-600"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Add Permission
      </h2>

      <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Permission Name
        </span>
        <input
          name="permissionName"
          type="text"
          value={formData.permissionName}
          onChange={handleChange}
          required
          disabled={loading}
          className="mt-1 w-full px-3 py-2 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </span>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          disabled={loading}
          className="mt-1 w-full px-3 py-2 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Action
        </span>
        <input
          name="action"
          type="text"
          value={formData.action}
          onChange={handleChange}
          disabled={loading}
          placeholder="e.g. create, read, update"
          className="mt-1 w-full px-3 py-2 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        />
      </label>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="w-1/2 mr-2 py-2 px-4 rounded bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-1/2 ml-2 py-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};

export default AddPrivilege;