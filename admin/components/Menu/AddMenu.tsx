"use client";

import React, { useState, useEffect } from "react";
import {
  MenuItem,
  CreateMenuItem,
  UpdateMenuItemPayload,
} from "@/types/menuTypes";
import {
  createMenuItem,
  fetchAllMenus,
  fetchMenuById,
  updateMenu,
} from "@/utils/menuApi";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

interface AddMenuProps {
  id: number;
  onClose: () => void;
  onCreate: () => void;
  onUpdate: () => void;
}

interface MenuOption {
  id: number;
  name: string;
}

const AddMenu: React.FC<AddMenuProps> = ({
  id,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const isEditing = id !== 0;

  const [formData, setFormData] = useState<UpdateMenuItemPayload>({
    Id: 0,
    Name: "",
    Url: null,
    Icon: null,
    RequiredPrivilege: null,
    ParentId: null,
    Order: null,
  });

  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);
  const [fetchingParentMenus, setFetchingParentMenus] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoadingInitialData(true);

      setFetchingParentMenus(true);
      try {
        const allMenus = await fetchAllMenus();
        setMenuOptions(
          allMenus
            .filter((menu) => menu.id !== id) // Exclude current item from parent options
            .map((menu) => ({ id: menu.id, name: menu.name }))
        );
      } catch (error) {
        toast.error("Failed to load parent menu options.");
        console.error("Error fetching parent menus:", error);
      } finally {
        setFetchingParentMenus(false);
      }

      if (!isEditing) {
        setFormData({
          Id: 0,
          Name: "",
          Url: null,
          Icon: null,
          RequiredPrivilege: null,
          ParentId: null,
          Order: null,
        });
        setLoadingInitialData(false);
      } else {
        try {
          const menuToEdit = await fetchMenuById(id);
          setFormData({
            Id: menuToEdit.id,
            Name: menuToEdit.name || "",
            Url: menuToEdit.url || null,
            Icon: menuToEdit.icon || null,
            RequiredPrivilege: menuToEdit.requiredPermission || null,
            ParentId: menuToEdit.parentId ?? null,
            Order: menuToEdit.order ?? null,
          });
          setLoadingInitialData(false);
        } catch (error) {
          toast.error("Failed to load menu for editing.");
          console.error("Error fetching menu for edit:", error);
          setLoadingInitialData(false);
          onClose();
        }
      }
    };

    loadData();
  }, [id, isEditing, onClose]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let newValue: string | number | null;

      if (name === "Order" || name === "ParentId") {
        newValue = value === "" ? null : parseInt(value);
        if (isNaN(newValue as number)) {
          newValue = null;
        }
      } else {
        newValue = value === "" ? null : value;
      }

      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateMenu(id, formData);
        toast.success("Menu updated successfully!");
        onUpdate();
      } else {
        const createPayload: CreateMenuItem = {
          Name: formData.Name,
          Url: formData.Url,
          Icon: formData.Icon,
          RequiredPrivilege: formData.RequiredPrivilege,
          ParentId: formData.ParentId,
          Order: formData.Order,
        };
        await createMenuItem(createPayload);
        toast.success("Menu created successfully!");
        onCreate();
      }
      onClose();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} menu.`);
      console.error(
        `Error ${isEditing ? "updating" : "creating"} menu:`,
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[600px] p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-600 dark:border-gray-600 ">
      {/* Header - Always fixed at the top */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700 relative flex-shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 z-10"
          aria-label="Close modal"
          disabled={isSubmitting}
        ></button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEditing ? "Edit Menu" : "Add New Menu"}
        </h2>
      </div>

      {/* Conditional content for loading state or form */}
      {loadingInitialData ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Loading menu data...
          </p>
        </div>
      ) : (
        // Scrollable Body - This div takes all available space and its content scrolls
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar min-h-0">
          <form id="menu-form" onSubmit={handleSubmit} className="space-y-4">
            {" "}
            {/* Added id="menu-form", form wraps only fields */}
            {/* All form fields here, including Order and Parent Menu */}
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Menu Name *
              </span>
              <input
                name="Name"
                type="text"
                value={formData.Name || ""}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="mt-1 w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Required Privilege
              </span>
              <input
                name="RequiredPrivilege"
                type="text"
                value={formData.RequiredPrivilege || ""}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g., menu.create"
                className="mt-1 w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                URL
              </span>
              <input
                name="Url"
                type="text"
                value={formData.Url || ""}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="/dashboard/analytics"
                className="mt-1 w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Icon
              </span>
              <input
                name="Icon"
                type="text"
                value={formData.Icon || ""}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g., home"
                className="mt-1 w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Order
              </span>
              <input
                name="Order"
                type="number"
                value={formData.Order ?? ""}
                onChange={handleChange}
                disabled={isSubmitting}
                min="0"
                className="mt-1 w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Parent Menu
              </span>
              <select
                name="ParentId"
                value={formData.ParentId === null ? "null" : formData.ParentId}
                onChange={handleChange}
                disabled={isSubmitting || fetchingParentMenus}
                className="mt-1 w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              >
                <option value="null">No Parent (Top Level)</option>
                {menuOptions.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </select>
              {fetchingParentMenus && (
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                  <Loader2 className="animate-spin h-3 w-3 mr-1" /> Loading
                  parent options...
                </span>
              )}
            </label>
          </form>
        </div>
      )}

      {/* Footer - Always fixed at the bottom, ensures it doesn't shrink */}
      {!loadingInitialData && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-1/2 mr-2 py-2 px-4 rounded bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="menu-form"
              disabled={isSubmitting || loadingInitialData}
              className="w-1/2 ml-2 py-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting && (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              )}
              {isEditing ? "Save Changes" : "Create Menu"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMenu;
