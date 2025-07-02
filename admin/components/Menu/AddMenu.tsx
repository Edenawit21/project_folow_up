"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Loader2, X } from "lucide-react";
import {
  fetchAllMenus,
  fetchMenuById,
  updateMenuItem,
  createMenuItem,
} from "@/utils/menuApi";

interface AddMenuProps {
  id: number; 
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
  const [originalData, setOriginalData] = useState<MenuFormData | null>(null);
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
          setOriginalData(emptyFormData);
        } else {
          const menu = await fetchMenuById(id);
          const fetched = {
            name: menu.name || "",
            url: menu.url || "",
            icon: menu.icon || "",
            requiredPrivilege: menu.requiredPrivilege || "",
            parentId: typeof menu.parentId === "number" ? menu.parentId : null,
            order: typeof menu.order === "number" ? menu.order : null,
          };
          setFormData(fetched);
          setOriginalData(fetched);
        }
      } catch {
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
    const parsedValue =
      name === "parentId" || name === "order"
        ? value === ""
          ? null
          : parseInt(value, 10)
        : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
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
    if (originalData) setFormData(originalData);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400"
        disabled={isSubmitting}
      >
        <X className="h-6 w-6" />
      </button>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
        {isEditing ? "Update Menu" : "Add New Menu"}
      </h2>

      {loadingInitialData ? (
        <div className="flex items-center justify-center p-6">
          <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
          <p className="ml-3 text-gray-600 dark:text-gray-400">
            Loading menu data...
          </p>
        </div>
      ) : (
        <form id="menu-form" onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "name", label: "Name", placeholder: "Enter menu name" },
            {
              name: "requiredPrivilege",
              label: "Required Privilege",
              placeholder: "Enter required privilege",
            },
            { name: "url", label: "URL", placeholder: "Enter URL" },
            {
              name: "icon",
              label: "Icon",
              placeholder: "Enter icon class (e.g., folder)",
            },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
              </label>
              <input
                name={name}
                type="text"
                value={(formData as any)[name]}
                onChange={handleChange}
                required={name === "name"}
                disabled={isSubmitting}
                placeholder={placeholder}
                className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Order
            </label>
            <input
              name="order"
              type="number"
              value={formData.order === null ? "" : formData.order}
              onChange={handleChange}
              disabled={isSubmitting}
              min={0}
              placeholder="Enter order"
              className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>

          <div className="flex flex-col-reverse">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Parent Menu
            </label>
            <select
              name="parentId"
              value={formData.parentId === null ? "" : formData.parentId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parentId:
                    e.target.value === "" ? null : parseInt(e.target.value, 10),
                }))
              }
              disabled={isSubmitting}
              className="w-full px-3 py-2 border rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
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
          </div>
        </form>
      )}

      {!loadingInitialData && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full py-2 px-4 rounded bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Reset
            </button>
            <button
              type="submit"
              form="menu-form"
              disabled={isSubmitting || loadingInitialData}
              className="w-full py-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white"
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
