"use client";

import { useState, useRef, useEffect } from "react";

const roles = [
  { id: "admin", name: "Admin" },
  { id: "editor", name: "Editor" },
  { id: "viewer", name: "Viewer" },
];

const privileges = [
  { id: "read", name: "Read" },
  { id: "write", name: "Write" },
  { id: "delete", name: "Delete" },
  { id: "update", name: "Update" },
];

export default function AssignPrivilege() {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handlePrivilegeChange = (id: string) => {
    setSelectedPrivileges((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    console.log("Assigned:", selectedPrivileges, "to", selectedRole);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-md ml-64 mt-10 p-6 space-y-6 border rounded-2xl shadow-md bg-white dark:bg-gray-900 text-black dark:text-white">
      <h2 className="text-2xl font-semibold text-center">Assign Privileges</h2>

      {/* Role Selector */}
      <div>
        <label className="block mb-1 font-medium">Select Role</label>
        <div className="relative">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 pr-8 rounded border dark:border-gray-700 appearance-none bg-white dark:bg-gray-800 text-black dark:text-white"
          >
            <option value="">-- Select a role --</option>
            {roles.map((role) => (
              <option
                key={role.id}
                value={role.id}
                className="bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                {role.name}
              </option>
            ))}
          </select>

          {/* Optional: Add a dropdown arrow manually */}
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.516 7.548L10 12.032l4.484-4.484L16 8.064l-6 6-6-6z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Privilege Multi-Select */}
      <div ref={dropdownRef} className="relative">
        <label className="block mb-1 font-medium">Select Privileges</label>
        <button
          type="button"
          onClick={toggleDropdown}
          className="w-full px-3 py-2 rounded border dark:border-gray-700 bg-white dark:bg-gray-800 text-left text-black dark:text-white"
        >
          {selectedPrivileges.length > 0
            ? privileges
                .filter((p) => selectedPrivileges.includes(p.id))
                .map((p) => p.name)
                .join(", ")
            : "Choose privileges"}
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 rounded border dark:border-gray-700 bg-white dark:bg-gray-800 shadow max-h-48 overflow-y-auto">
            {privileges.map((priv) => (
              <label
                key={priv.id}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  checked={selectedPrivileges.includes(priv.id)}
                  onChange={() => handlePrivilegeChange(priv.id)}
                  className="mr-2"
                />
                {priv.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedRole || selectedPrivileges.length === 0}
          className="px-6 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Assign Privileges
        </button>
      </div>
    </div>
  );
}
