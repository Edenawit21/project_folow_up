"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { fetchRoleById, createRole, updateRole } from "@/utils/roleApi";
import { fetchPrivileges } from "@/utils/privilegeApi";
import { RoleData, Privilege } from "@/types";
import { Loader2 } from "lucide-react";

const CreateRole: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleId = searchParams.get("id");
  const isEdit = searchParams.get("edit") === "true";

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
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

  // Load role if in edit mode
  useEffect(() => {
    if (isEdit && roleId) {
      loadRole();
    }
  }, [isEdit, roleId]);

  const loadRole = async () => {
    setLoading(true);
    try {
      const role: RoleData = await fetchRoleById(roleId!);
      setRoleName(role.name);
      setDescription(role.description || "");
      setSelectedPrivileges(
        Array.isArray(role.permissions) ? role.permissions : []
      );
    } catch {
      toast.error("Failed to load role.");
      router.push("/dashboard/roles/create_role");
    } finally {
      setLoading(false);
    }
  };

  const togglePrivilege = (id: string) => {
    setSelectedPrivileges((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
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

    const payload = {
      name: roleName.trim(),
      description: description.trim(),
      permissions: selectedPrivileges,
    };

    try {
      if (isEdit && roleId) {
        await updateRole(roleId, payload);
        toast.success("Role updated successfully.");
      } else {
        await createRole(payload);
        toast.success("Role created successfully.");
      }

      router.push("/dashboard/roles/create_role");
    } catch (error) {
      toast.error("Failed to save role.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const getSelectedPrivilegeNames = () => {
    if (selectedPrivileges.length === 0) return "Select permissions";
    return (
      privileges
        .filter((p) => selectedPrivileges.includes(p.id))
        .slice(0, 3)
        .map((p) => p.permissionName)
        .join(", ") +
      (selectedPrivileges.length > 3
        ? ` +${selectedPrivileges.length - 3} more`
        : "")
    );
  };

  return (
    <div className="px-4 py-8 w-[600px] ml-60">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {isEdit ? "Edit Role" : "Create New Role"}
          </h2>
        </div>

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

          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Assign Permissions *
            </label>

            {loading ? (
              <div className="flex items-center justify-center p-8 border border-gray-300 rounded-sm bg-gray-50 dark:bg-gray-700">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                <span className="ml-3 text-gray-600 dark:text-gray-300">
                  Loading permissions...
                </span>
              </div>
            ) : (
              <div ref={dropdownRef} className="relative w-full">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  disabled={loading}
                  className={`w-full px-4 py-3 border ${
                    dropdownOpen
                      ? "border-indigo-500 ring-1 ring-indigo-500"
                      : "border-gray-300"
                  } rounded-sm bg-white dark:bg-gray-700 text-left text-gray-900 dark:text-white focus:outline-none flex justify-between items-center transition-all`}
                >
                  <span className="truncate">
                    {getSelectedPrivilegeNames()}
                  </span>
                  <svg
                    className={`w-5 h-5 ml-2 transition-transform ${
                      dropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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
                    {privileges.map((priv) => (
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
                    ))}

                    {privileges.length === 0 && (
                      <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                        No permissions available
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedPrivileges.length} permission(s) selected
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-sm font-medium transition-colors disabled:opacity-50 w-1/2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || submitting}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-sm font-medium transition-colors flex items-center justify-center disabled:opacity-50 w-1/2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  {isEdit ? "Updating..." : "Creating..."}
                </>
              ) : isEdit ? (
                "Update Role"
              ) : (
                "Create Role"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRole;
