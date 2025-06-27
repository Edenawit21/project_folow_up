"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchRoleById, createRole, updateRole } from "@/utils/roleApi";
import { fetchAllPermissions } from "@/utils/privilegeApi";
import {
  RoleData,
  RolePayload,
  CreateRoleProps,
  RoleUpdatePayload,
} from "@/types/role";
import { Permission } from "@/types/privilege";
import { Loader2, Search, X } from "lucide-react";

const CreateRole: React.FC<CreateRoleProps> = ({
  id,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const isEdit = Boolean(id);

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const loadPermissions = async () => {
      setLoading(true);
      try {
        const data = await fetchAllPermissions();
        setPermissions(data);
      } catch {
        toast.error("Failed to load Privileges.");
      } finally {
        setLoading(false);
      }
    };
    loadPermissions();
  }, []);

  useEffect(() => {
    if (isEdit && id && permissions.length) {
      loadRole(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, id, permissions]);

  const loadRole = async (roleId: string) => {
    setLoading(true);
    try {
      const role: RoleData = await fetchRoleById(roleId);
      setRoleName(role.name);
      setDescription(role.description || "");
      const permIds = Array.isArray(role.permissions)
        ? (role.permissions
            .map((permName: string) => {
              const found = permissions.find(
                (p) => p.permissionName === permName
              );
              return found?.id;
            })
            .filter(Boolean) as string[])
        : [];
      setSelectedPermissions(permIds);
    } catch {
      toast.error("Failed to load role.");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  };

  const handleReset = () => {
    if (isEdit && id) {
      loadRole(id); // Reload original values in edit mode
    } else {
      setRoleName("");
      setDescription("");
      setSelectedPermissions([]);
    }
    setSearchTerm("");
    setDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return toast.warning("Role name is required.");
    if (selectedPermissions.length === 0)
      return toast.warning("Please select at least one permission.");
    setSubmitting(true);
    try {
      if (isEdit && id) {
        const updatePayload: RoleUpdatePayload = {
          name: roleName.trim(),
          description: description.trim(),
          permissionsToAdd: selectedPermissions,
        };
        await updateRole(id, updatePayload);
        toast.success("Role updated successfully.");
        await onUpdate?.(updatePayload);
      } else {
        const createPayload: RolePayload = {
          name: roleName.trim(),
          description: description.trim(),
          permissionIds: selectedPermissions,
        };
        await createRole(createPayload);
        toast.success("Role created successfully.");
        await onCreate?.(createPayload);
      }
      onClose();
    } catch {
      toast.error("Failed to save role.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPermissions = permissions.filter((perm) =>
    perm.permissionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[90vh]">
      {/* Header */}
      <div className="relative border-b pb-4 mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
          {isEdit ? "Update Role" : "Create New Role"}
        </h2>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-gray-600 dark:text-white hover:text-red-500"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
          <span className="ml-3 text-indigo-600">Loading...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role Name *
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g., Administrator"
              required
              className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the role..."
              className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Permissions Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full px-4 py-3 border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-left relative"
            >
              <span
                className={
                  selectedPermissions.length
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500"
                }
              >
                {selectedPermissions.length
                  ? permissions
                      .filter((perm) => selectedPermissions.includes(perm.id))
                      .map((perm) => perm.permissionName)
                      .join(", ")
                  : "Select permissions..."}
              </span>
              <svg
                className={`w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 transform transition-transform ${
                  dropdownOpen ? "-rotate-180" : "rotate-0"
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
              <div className="absolute z-10 bottom-full mb-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-64 overflow-y-auto">
                <div className="p-2 sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search permissions..."
                      className="w-full pl-10 pr-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                {filteredPermissions.length > 0 ? (
                  filteredPermissions.map((perm) => (
                    <label
                      key={perm.id}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <span className="ml-3 text-gray-900 dark:text-white">
                        {perm.permissionName}
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                    No matching permissions.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-1/2 py-2 px-4 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-400 rounded"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-1/2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded"
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
  );
};

export default CreateRole;
