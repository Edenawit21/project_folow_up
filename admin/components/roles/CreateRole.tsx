"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  fetchRoleById,
  createRole,
  updateRole,
 
} from "@/utils/roleApi"; 
import { fetchPrivileges} from "@/utils/privilegeApi"
import { RoleData } from "@/types";

import { Privilege } from "@/types";
const CreateRole: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleId = searchParams.get("id");
  const isEdit = searchParams.get("edit");

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPrivilege, setSelectedPrivilege] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [privileges, setPrivileges] = useState<Privilege[]>([]);

  // Load all available privileges
  // useEffect(() => {
  //   const loadPrivileges = async () => {
  //     try {
  //       const data = await fetchPrivileges();
  //       setPrivileges(data);
  //     } catch {
  //       toast.error("Failed to load privileges.");
  //     }
  //   };
  //   loadPrivileges();
  // }, []);

  // If edit mode, load the role's existing data
  useEffect(() => {
    if (isEdit && roleId) {
      setIsEditMode(true);

      const loadRole = async () => {
        try {
          const role: RoleData = await fetchRoleById(roleId);
          setRoleName(role.name);
          setDescription(role.description || "");
          setSelectedPrivilege(role.privilegeId ?? "");
        } catch {
          toast.error("Failed to load role.");
          router.push("/dashboard/roles/create_role");
        }
      };

      loadRole();
    }
  }, [isEdit, roleId, router]);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      toast.warning("Role name is required.");
      return;
    }

    if (!selectedPrivilege) {
      toast.warning("Please select a privilege.");
      return;
    }

    const payload = {
      name: roleName,
      description,
      privilegeId: selectedPrivilege,
    };

    try {
      if (isEditMode && roleId) {
        await updateRole(roleId, payload);
        toast.success("Role updated successfully.");
      } else {
        await createRole(payload);
        toast.success("Role created successfully.");
      }

      router.push("/dashboard/roles/create_role");
    } catch {
      toast.error("Failed to save role.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="w-[500px] ml-64 mt-10 bg-white dark:bg-gray-800 p-6 rounded-sm border border-gray-200 dark:border-gray-700 shadow-md">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
        {isEditMode ? "Edit Role" : "Create Role"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        <div>
          <label
            htmlFor="roleName"
            className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
          >
            Role Name
          </label>
          <input
            id="roleName"
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Enter role name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
            placeholder="Enter description (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label
            htmlFor="privilege"
            className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
          >
            Assign Privilege
          </label>
          <select
            id="privilege"
            value={selectedPrivilege}
            onChange={(e) => setSelectedPrivilege(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select privilege</option>
            {privileges.map((priv) => (
              <option key={priv.id} value={priv.id}>
                {priv.permissionName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="w-1/2 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-1/2 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition-colors"
          >
            {isEditMode ? "Update Role" : "Create Role"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRole;
