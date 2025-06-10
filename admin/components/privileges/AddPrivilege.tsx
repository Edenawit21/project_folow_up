"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { PrivilegeFormData } from "@/types";
import {
  createPrivilege,
  updatePrivilege,
  fetchPrivilegeById,
} from "@/utils/privilegeApi";
import { toast } from "react-toastify";

const AddPrivilege = () => {
  const [formData, setFormData] = useState<PrivilegeFormData>({
    permissionName: "",
    description: "",
    action: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchPrivilegeById(id)
        .then((data) => {
          setFormData({
            permissionName: data.permissionName ?? "",
            description: data.description ?? "",
            action: data.action ?? "",
          });
        })
        .catch(() => {
          toast.error("Failed to load privilege.");
        })
        .finally(() => setLoading(false));
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
        await updatePrivilege(id, formData);
        toast.success("Permission updated successfully!");
      } else {
        await createPrivilege(formData);
        toast.success("Permission created successfully!");
      }
      router.push("/dashboard/privileges/privilege_list");
    } catch {
      toast.error(
        id ? "Failed to update privilege." : "Failed to create privilege."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Optional: Show loading text while fetching privilege data
  if (id && loading) {
    return (
      <div className="w-full max-w-md mx-auto mt-10 p-6 text-center text-gray-700 dark:text-gray-300">
        Loading privilege data...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow border border-gray-300 dark:border-gray-600"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        {id ? "Update Permission" : "Add Permission"}
      </h2>

      <div className="mb-4">
        <label
          htmlFor="permissionName"
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Permission Name
        </label>
        <input
          id="permissionName"
          name="permissionName"
          type="text"
          value={formData.permissionName}
          onChange={handleChange}
          required
          disabled={loading}
          className="w-full px-3 py-2 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          disabled={loading}
          className="w-full px-3 py-2 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="action"
          className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Action
        </label>
        <input
          id="action"
          name="action"
          type="text"
          value={formData.action}
          onChange={handleChange}
          disabled={loading}
          placeholder="e.g. create, read, update"
          className="w-full px-3 py-2 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleCancel}
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
            ? "Update Permission"
            : "Create Permission"}
        </button>
      </div>
    </form>
  );
};

export default AddPrivilege;
