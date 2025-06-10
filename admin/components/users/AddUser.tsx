"use client";

import { useEffect, useState } from "react";
import { RoleData, CreateUserDto } from "@/types";
import { fetchAllRoles } from "@/utils/roleApi";
import { registerUser } from "@/utils/userApi";
import { toast } from "react-toastify"; // Optional if you're using toast

const AddUser = () => {
  const [formData, setFormData] = useState<CreateUserDto>({
    firstName: "",
    lastName: "",
    accountId: "",
    email: "",
    roles: [],
  });

  const [roles, setRoles] = useState<RoleData[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const apiResponse = await fetchAllRoles();
        const roleData: RoleData[] = apiResponse.value || [];
        setRoles(roleData);
      } catch (error) {
        toast.error("Failed to load roles.");
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (roleName: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleName)
        ? prev.roles.filter((r) => r !== roleName)
        : [...prev.roles, roleName],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await registerUser(formData);
      setMessage("User created successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        accountId: "",
        email: "",
        roles: [],
      });
    } catch (err: any) {
      console.error("Error creating user:", err);
      setError(err.response?.data?.message || "Failed to create user.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add User</h2>

      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="accountId"
          value={formData.accountId}
          onChange={handleChange}
          placeholder="Account ID"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />

        {/* Role Dropdown */}
        <div className="relative">
          <label className="block font-medium">Assign Roles</label>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full border p-2 rounded text-left bg-white"
          >
            {formData.roles.length > 0
              ? formData.roles.join(", ")
              : "Select roles"}
          </button>
          {dropdownOpen && (
            <div className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow">
              {roles.map((role) => (
                <label
                  key={role.roleId}
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role.name)}
                    onChange={() => handleRoleChange(role.name)}
                    className="mr-2"
                  />
                  {role.name}
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
