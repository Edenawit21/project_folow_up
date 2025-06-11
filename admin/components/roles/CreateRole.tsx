"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { fetchRoleById, createRole, updateRole } from "@/utils/roleApi";
import { fetchPrivileges } from "@/utils/privilegeApi";
import { RoleData, Privilege } from "@/types";

const CreateRole: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleId = searchParams.get("id");
  const isEdit = searchParams.get("edit");

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [privileges, setPrivileges] = useState<Privilege[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);

  // Load all available privileges
  useEffect(() => {
    const loadPrivileges = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPrivileges();
        setPrivileges(
          data.map((priv: any) => ({
            ...priv,
            createdAt: priv.createdAt ?? "",
          }))
        );
      } catch (error) {
        toast.error("Failed to load privileges.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPrivileges();
  }, []);

  // If edit mode, load the role's existing data
  useEffect(() => {
    if (isEdit && roleId) {
      setIsEditMode(true);

      const loadRole = async () => {
        try {
          setIsLoading(true);
          const role: RoleData = await fetchRoleById(roleId);
          setRoleName(role.name);
          setDescription(role.description || "");
          setSelectedPermissionIds(role.privileges ? role.privileges
            .map((p: any) => p.id) : []);
        } catch (error) {
          toast.error("Failed to load role.");
          console.error(error);
          router.push("/dashboard/roles");
        } finally {
          setIsLoading(false);
        }
      };

      loadRole();
    }
  }, [isEdit, roleId, router]);

  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissionIds(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPermissionIds(privileges.map(priv => priv.id));
    } else {
      setSelectedPermissionIds([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      toast.warning("Role name is required.");
      return;
    }

    if (selectedPermissionIds.length === 0) {
      toast.warning("Please select at least one permission.");
      return;
    }

    const payload = {
      name: roleName,
      description,
      permissionIds: selectedPermissionIds,
    };

    try {
      setIsLoading(true);
      if (isEditMode && roleId) {
        await updateRole(roleId, payload);
        toast.success("Role updated successfully.");
      } else {
        await createRole(payload);
        toast.success("Role created successfully.");
      }
      router.push("/dashboard/roles/role_list");
    } catch (error) {
      toast.error("Failed to save role.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {

    router.back();
  };

  if (isLoading) {
    return <div className="ml-64 mt-10 p-6">Loading...</div>;
  }

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
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Assign Permissions
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="select-all"
                checked={selectedPermissionIds.length === privileges.length && privileges.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="select-all"
                className="ml-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Select All
              </label>
            </div>
            {privileges.map((priv) => (
              <div key={priv.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`perm-${priv.id}`}
                  checked={selectedPermissionIds.includes(priv.id)}
                  onChange={() => handlePermissionChange(priv.id)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`perm-${priv.id}`}
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  {priv.permissionName}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="w-1/2 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded font-semibold transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-1/2 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition-colors"
            disabled={isLoading}
          >
            {isLoading
              ? "Processing..."
              : isEditMode
              ? "Update Role"
              : "Create Role"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRole;