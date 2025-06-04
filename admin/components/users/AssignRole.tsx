"use client";

import { useState, useRef, useEffect } from "react";

const users = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
];

const roles = [
  { id: "admin", name: "Admin" },
  { id: "editor", name: "Editor" },
  { id: "viewer", name: "Viewer" },
];

export default function AssignRoleForm() {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleRoleChange = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = () => {
    console.log("Assigning roles", selectedRoles, "to user", selectedUser);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-md ml-64 mt-10 p-6 space-y-6 rounded-2xl shadow-lg bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-center">Assign Roles to User</h1>

      {/* Select User */}
      <div>
        <label className="block mb-1 font-medium">Select User</label>
        <select
          className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white dark:shadow-2xl" 
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- Select a user --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown for Roles */}
      <div className="relative" ref={dropdownRef}>
        <label className="block mb-1 font-medium">Select Roles</label>
        <button
          onClick={toggleDropdown}
          className="w-full px-3 py-2 text-left rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white"
        >
          {selectedRoles.length > 0
            ? roles
                .filter((r) => selectedRoles.includes(r.id))
                .map((r) => r.name)
                .join(", ")
            : "Choose roles"}
        </button>

        {dropdownOpen && (
          <div className="absolute mt-1 w-full max-h-48 overflow-y-auto z-10 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg">
            {roles.map((role) => (
              <label
                key={role.id}
                className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => handleRoleChange(role.id)}
                  className="mr-2"
                />
                {role.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedUser || selectedRoles.length === 0}
          className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Assign Roles
        </button>
      </div>
    </div>
  );
}
