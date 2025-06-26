"use client";

import React, { useState, useEffect, useRef } from "react";
import { PrivilegePayload, AddPrivilegeProps } from "@/types/privilege";
import {
  createPermission,
  updatePermission,
  getPermissionById,
} from "@/utils/privilegeApi";
import { toast } from "react-toastify";
import { Loader2, X } from "lucide-react";

const AddPrivilege: React.FC<AddPrivilegeProps> = ({
  id,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const [initialFormData, setInitialFormData] = useState<PrivilegePayload>({
    permissionName: "",
    description: "",
    action: "",
  });

  const [formData, setFormData] = useState<PrivilegePayload>({
    permissionName: "",
    description: "",
    action: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Fetch privilege data if editing
  useEffect(() => {
    if (id) {
      setFetching(true);
      getPermissionById(id)
        .then((data) => {
          const loadedData = {
            permissionName: data.permissionName || "",
            description: data.description || "",
            action: data.action || "",
          };
          setFormData(loadedData);
          setInitialFormData(loadedData);
        })
        .catch(() => {
          toast.error("Failed to load privilege.");
        })
        .finally(() => setFetching(false));
    } else {
      const emptyData = { permissionName: "", description: "", action: "" };
      setFormData(emptyData);
      setInitialFormData(emptyData);
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
        const updated = await updatePermission(id, formData);
        toast.success("Privilege updated successfully!");
        onUpdate?.(updated);
      } else {
        const created = await createPermission(formData);
        toast.success("Privilege created successfully!");
        onCreate?.(created);
      }
      onClose();
    } catch {
      toast.error("Failed to save privilege.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
  };

  if (id && fetching) {
    return (
      <div className="w-full max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-600 flex items-center">
        <Loader2 className="animate-spin text-indigo-600 w-6 h-6" />
        <span className="ml-2 text-gray-700 dark:text-white">
          Loading privilege...
        </span>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="relative w-full max-w-xl mx-auto px-4 py-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      {/* X Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg"
        aria-label="Close"
        disabled={loading}
      >
        <X className="w-6 h-6 hover:text-red-500" />
      </button>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center sm:text-left">
        {id ? "Update Privilege" : "Add Privilege"}
      </h2>

      {/* Permission Name */}
      <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Privilege Name
        </span>
        <input
          name="permissionName"
          type="text"
          value={formData.permissionName}
          onChange={handleChange}
          required
          disabled={loading}
          className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
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
          className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
        />
      </label>

      {/* Action */}
      <label className="block mb-6">
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
          className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
        />
      </label>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="w-full sm:w-1/2 py-2 px-4 rounded bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-1/2 py-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white"
        >
          {loading
            ? id
              ? "Updating..."
              : "Creating..."
            : id
            ? "Update Privilege"
            : "Create Privilege"}
        </button>
      </div>
    </form>
  );
};

export default AddPrivilege;
