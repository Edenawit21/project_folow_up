"use client";
import React, { useState } from "react";
import { MenuItem, CreateMenuProps } from "@/types/menuTypes";
import { v4 as uuidv4 } from "uuid";



const CreateMenu: React.FC<CreateMenuProps> = ({
  onCreate,
  onCancel,
  parentId = "0",
}) => {
  const [form, setForm] = useState<Omit<MenuItem, "id" | "children">>({
    name: "",
    url: "",
    icon: "",
    requiredPrivilege: "",
    parentId,
    order: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ ...form, id: uuidv4(), children: [] });
    setForm({
      name: "",
      url: "",
      icon: "",
      requiredPrivilege: "",
      parentId,
      order: 0,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl p-6 bg-white rounded-2xl  space-y-4"
    >
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <input
        name="url"
        value={form.url}
        onChange={handleChange}
        placeholder="URL"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="icon"
        value={form.icon as string}
        onChange={handleChange}
        placeholder="Icon"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <input
        name="requiredPrivilege"
        value={form.requiredPrivilege}
        onChange={handleChange}
        placeholder="Required Privilege"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        name="order"
        value={form.order}
        onChange={handleChange}
        placeholder="Order"
        min={0}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors w-1/2"
        >
          Create Menu
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition-colors w-1/2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateMenu;
