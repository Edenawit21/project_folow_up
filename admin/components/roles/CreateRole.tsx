"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { fetchRoleById, createRole, updateRole } from "@/utils/roleApi";
import { fetchPrivileges } from "@/utils/privilegeApi";
import { RoleData, Privilege } from "@/types";
import { Loader2, Search } from "lucide-react";

interface RolePayload {
  name: string;
  description: string;
  permissions: string[];
}

interface CreateRoleProps {
  id?: string;
  onClose: () => void;
  onCreate?: (data: RolePayload) => void;
  onUpdate?: (data: RolePayload) => void;
}

const CreateRole: React.FC<CreateRoleProps> = ({
  id,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const isEdit = Boolean(id);

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load privileges
  useEffect(() => {
    const loadPrivileges = async () => {
      setLoading(true);
      try {
        const data = await fetchPrivileges();
        setPrivileges(
          data.map((priv) => ({ ...priv, action: priv.action ?? "" }))
        );
      } catch {
        toast.error("Failed to load privileges.");
      } finally {
        setLoading(false);
      }
    };
    loadPrivileges();
  }, []);

  // Load role if editing
  useEffect(() => {
    if (isEdit && id) {
      loadRole();
    }
  }, [isEdit, id]);

  const loadRole = async () => {
    setLoading(true);
    try {
      const role: RoleData = await fetchRoleById(id!);
      setRoleName(role.name);
      setDescription(role.description || "");
      setSelectedPrivileges(
        Array.isArray(role.permissions) ? role.permissions : []
      );
    } catch {
      toast.error("Failed to load role.");
      onClose(); // Close the form if load fails
    } finally {
      setLoading(false);
    }
  };

  const togglePrivilege = (privId: string) => {
    setSelectedPrivileges((prev) =>
      prev.includes(privId)
        ? prev.filter((p) => p !== privId)
        : [...prev, privId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!roleName.trim()) {
      toast.warning("Role name is required.");
      setSubmitting(false);
      return;
    }

    if (selectedPrivileges.length === 0) {
      toast.warning("Please select at least one privilege.");
      setSubmitting(false);
      return;
    }

    const payload: RolePayload = {
      name: roleName.trim(),
      description: description.trim(),
      permissions: selectedPrivileges,
    };

    try {
      if (isEdit && id) {
        await updateRole(id, payload);
        toast.success("Role updated successfully.");
        if (onUpdate) onUpdate(payload);
      } else {
        await createRole(payload);
        toast.success("Role created successfully.");
        if (onCreate) onCreate(payload);
      }

      onClose();
    } catch {
      toast.error("Failed to save role.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => onClose();

  // Reset search when dropdown opens
  useEffect(() => {
    if (dropdownOpen) setSearchTerm("");
  }, [dropdownOpen]);

  // Filter privileges based on search term
  const filteredPrivileges = privileges.filter((priv) =>
    priv.permissionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 py-8 w-[600px] ml-60">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {isEdit ? "Update Role" : "Create New Role"}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-indigo-600">Loading...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="roleName"
                className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
              >
                Role Name *
              </label>
              <input
                id="roleName"
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g., Administrator, Manager"
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose of this role..."
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div ref={dropdownRef} className="relative w-full">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                disabled={loading}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                className={`w-full px-4 py-3 border ${
                  dropdownOpen
                    ? "border-indigo-500 ring-1 ring-indigo-500"
                    : "border-gray-300"
                } rounded-sm bg-white dark:bg-gray-700 text-left text-gray-900 dark:text-white flex justify-between items-center transition-all`}
              >
                <span
                  className={
                    selectedPrivileges.length
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-500 dark:text-gray-400"
                  }
                >
                  {selectedPrivileges.length > 0
                    ? `${selectedPrivileges.length} permission${
                        selectedPrivileges.length > 1 ? "s" : ""
                      } selected`
                    : "Select permissions..."}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 border-[1px] border-gray-300 rounded-sm shadow-lg max-h-60 overflow-y-auto">
                  <div className="sticky top-0 bg-white dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search permissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {filteredPrivileges.length > 0 ? (
                    filteredPrivileges.map((priv) => (
                      <label
                        key={priv.id}
                        htmlFor={`priv-${priv.id}`}
                        className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <input
                          type="checkbox"
                          id={`priv-${priv.id}`}
                          checked={selectedPrivileges.includes(priv.id)}
                          onChange={() => togglePrivilege(priv.id)}
                          className="h-4 w-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
                        />
                        <div className="ml-3 flex flex-col">
                          <span className="text-gray-900 dark:text-gray-100 font-medium">
                            {priv.permissionName}
                          </span>
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                      No matching permissions found.
                    </div>
                  )}
                </div>
              )}
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
                disabled={loading || submitting}
                className="w-1/2 ml-2 py-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white"
              >
                {submitting
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                  ? "Update Role"
                  : "Create Role"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateRole;
