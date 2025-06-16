"use client";

import React, { useEffect, useState, useRef } from "react";
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
import { Loader2, Search } from "lucide-react";

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

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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
    if (isEdit && id) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      toast.warning("Role name is required.");
      return;
    }
    if (selectedPermissions.length === 0) {
      toast.warning("Please select at least one permission.");
      return;
    }

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
        onUpdate?.(updatePayload);
      } else {
        const createPayload: RolePayload = {
          name: roleName.trim(),
          description: description.trim(),
          permissionIds: selectedPermissions,
        };
        await createRole(createPayload);
        toast.success("Role created successfully.");
        onCreate?.(createPayload);
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
    <div className="px-4 py-8 w-[600px] ml-60">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
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
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Role Name *
              </label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g., Administrator"
                required
                className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe the role..."
                className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div ref={dropdownRef} className="relative w-full">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-full px-4 py-3 border ${
                  dropdownOpen
                    ? "border-indigo-500 ring-1 ring-indigo-500"
                    : "border-gray-300"
                } rounded-sm bg-white dark:bg-gray-700 flex justify-between items-center`}
              >
                <span
                  className={
                    selectedPermissions.length
                      ? "text-gray-900 dark:text-gray-100"
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
                  className={`w-5 h-5 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
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
                <div className="absolute z-10 bottom-full mb-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 rounded-sm shadow-lg max-h-60 overflow-y-auto w-1/2 items-center">
                  <div className="sticky top-0 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search permissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  {filteredPermissions.length > 0 ? (
                    filteredPermissions.map((perm) => (
                      <label
                        key={perm.id}
                        htmlFor={`perm-${perm.id}`}
                        className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <input
                          id={`perm-${perm.id}`}
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <span className="ml-3 text-gray-900 dark:text-gray-100 font-medium">
                          {perm.permissionName}
                        </span>
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
                onClick={onClose}
                className="w-1/2 mr-2 py-2 px-4 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-1/2 ml-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded"
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
