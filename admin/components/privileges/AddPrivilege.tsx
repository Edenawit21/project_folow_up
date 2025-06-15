"use client";

import React, { useState, useEffect } from "react";
import { PrivilegePayload, AddPrivilegeProps } from "@/types/privilege";
import {
  createPermission,
  updatePermission,
  getPermissionById,
} from "@/utils/privilegeApi";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const AddPrivilege: React.FC<AddPrivilegeProps> = ({
  id,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<PrivilegePayload>({
    permissionName: "",
    description: "",
    action: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (id) {
      setFetching(true);
      getPermissionById(id)
        .then((data) => {
          setFormData({
            permissionName: data.permissionName || "",
            description: data.description || "",
            action: data.action || "",
          });
        })
        .catch(() => {
          toast.error("Failed to load privilege.");
        })
        .finally(() => setFetching(false));
    }
  }, [id]);

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
      if (id) {
        const updatedPermission = await updatePermission(id, formData);
        toast.success("Privilege updated successfully!");
        onUpdate?.(updatedPermission);
      } else {
        const createdPermission = await createPermission(formData);
        toast.success("Privilege created successfully!");
        onCreate?.(createdPermission);
      }
      onClose();
    } catch {
      toast.error(
        id ? "Failed to update privilege." : "Failed to create privilege."
      );
    } finally {
      setLoading(false);
    }
  };

  if (id && fetching) {
    return (
      <div className="w-[500px] p-6 bg-white dark:bg-gray-800 rounded shadow border border-gray-300 dark:border-gray-600 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 w-6 h-6" />
        <span className="ml-2 text-gray-700 dark:text-white">
          Loading privilege...
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[600px] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-300 dark:border-gray-600"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {id ? "Update Privilege" : "Add Privilege"}
      </h2>

      {/* Permission Name */}
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

      {/* Description */}
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

      {/* Action */}
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

      {/* Buttons */}
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
          {loading
            ? id
              ? "Updating..."
              : "Creating..."
            : id
            ? "Update"
            : "Create"}
        </button>
      </div>
    </form>
  );
};

export default AddPrivilege;
