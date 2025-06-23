"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Loader2, X } from "lucide-react";
import {
  fetchAllMenus,
  fetchMenuById,
  updateMenuItem,
  createMenuItem,
} from "@/utils/menuApi";

interface AddMenuProps {
  id: number; // menu id to edit; 0 = create new
  onClose: () => void;
  onCreate: () => void;
  onUpdate: () => void;
}

interface MenuFormData {
  name: string;
  url: string;
  icon: string;
  requiredPrivilege: string;
  parentId: number | null;
  order: number | null;
}

const AddMenu: React.FC<AddMenuProps> = ({
  id,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const isEditing = id !== 0;

  const emptyFormData: MenuFormData = {
    name: "",
    url: "",
    icon: "",
    requiredPrivilege: "",
    parentId: null,
    order: null,
  };

  const [formData, setFormData] = useState<MenuFormData>(emptyFormData);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuOptions, setMenuOptions] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const loadData = async () => {
      setLoadingInitialData(true);

      try {
        const allMenus = await fetchAllMenus();
        setMenuOptions(allMenus);

        if (!isEditing) {
          setFormData(emptyFormData);
        } else {
          const menu = await fetchMenuById(id);
          setFormData({
            name: menu.name || "",
            url: menu.url || "",
            icon: menu.icon || "",
            requiredPrivilege: menu.requiredPrivilege || "",
            parentId: typeof menu.parentId === "number" ? menu.parentId : null,
            order: typeof menu.order === "number" ? menu.order : null,
          });
        }
      } catch (err) {
        toast.error("Failed to load data.");
        onClose();
      } finally {
        setLoadingInitialData(false);
      }
    };

    loadData();
  }, [id, isEditing, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "parentId" || name === "order") {
      // If empty string, set null; else parse number
      const num = value === "" ? null : parseInt(value, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: num,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateMenuItem(id, formData);
        toast.success("Menu updated successfully!");
        onUpdate();
      } else {
        await createMenuItem(formData);
        toast.success("Menu created successfully!");
        onCreate();
      }
      onClose();
    } catch {
      toast.error(`Failed to ${isEditing ? "update" : "create"} menu.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(emptyFormData);
  };

  return (
    <div className="w-[600px] max-h-[90vh] overflow-hidden p-3 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-600 dark:border-gray-600">
      <div className="px-6 pt-2 pb-4 border-b border-gray-200 dark:border-gray-700 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          disabled={isSubmitting}
        >
          <X className="h-6 w-6 hover:text-red-500" />
        </button>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEditing ? "Update Menu" : "Add New Menu"}
        </h2>
      </div>

      {loadingInitialData ? (
        <div className="flex items-center justify-center p-6">
          <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
          <p className="ml-3 text-gray-600 dark:text-gray-400">
            Loading menu data...
          </p>
        </div>
      ) : (
        <form
          id="menu-form"
          onSubmit={handleSubmit}
          className="px-6 py-4 space-y-4"
        >
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300"></span>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="Enter menu name"
              className="mt-1 w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300"></span>
            <input
              name="requiredPrivilege"
              type="text"
              value={formData.requiredPrivilege}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Enter required privilege )"
              className="mt-1 w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300"></span>
            <input
              name="url"
              type="text"
              value={formData.url}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Enter URL"
              className="mt-1 w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300"></span>
            <input
              name="icon"
              type="text"
              value={formData.icon}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Enter icon class (e.g., folder)"
              className="mt-1 w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </label>
          <input
            name="order"
            type="number"
            value={formData.order === null ? "" : formData.order}
            onChange={handleChange}
            disabled={isSubmitting}
            min={0}
            placeholder="Enter order "
            className="mt-1 w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />

          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
              Parent Menu
            </span>
            <select
              name="parentId"
              value={formData.parentId === null ? "" : formData.parentId}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? null : parseInt(e.target.value, 10);
                setFormData((prev) => ({
                  ...prev,
                  parentId: value,
                }));
              }}
              disabled={isSubmitting}
              className="mt-1 w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600  "
            >
              <option value="">No Parent</option>
              {menuOptions
                .filter((menu) => menu.id !== id)
                .map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
            </select>
          </label>
        </form>
      )}

      {!loadingInitialData && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-1/2 py-2 px-4 rounded bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Reset
            </button>
            <button
              type="submit"
              form="menu-form"
              disabled={isSubmitting || loadingInitialData}
              className="w-1/2 py-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting && (
                <Loader2 className="animate-spin mr-2 h-4 w-4 inline-block" />
              )}
              {isEditing ? "Update Menu" : "Create Menu"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMenu;
