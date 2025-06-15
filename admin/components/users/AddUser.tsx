"use client";

import { useEffect, useState } from "react";
import { RoleData } from "@/types/role";
import { fetchAllRoles } from "@/utils/roleApi";
import { registerUser, fetchUserById, updateUser } from "@/utils/userApi";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import { CreateUserDto, UserForm } from "@/types/user";

interface AddUserProps {
  userId?: string;
  onClose: () => void;
  onCreate: (data: UserForm) => void;
  onUpdate: () => void;
}

const AddUser = ({ userId, onClose }: AddUserProps) => {
  const isEdit = !!userId;
  const [formData, setFormData] = useState<CreateUserDto>({
    firstName: "",
    lastName: "",
    accountId: "",
    email: "",
    roles: [],
  });

  const [roles, setRoles] = useState<RoleData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const role = await fetchAllRoles();
        setRoles(role);

        if (userId) {
          const user = await fetchUserById(userId);
          setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            accountId: user.accountId,
            email: user.email,
            roles: user.roles || [],
          });
        }
      } catch {
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isEdit, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      if (isEdit && userId) {
        await updateUser(userId, formData);
        setMessage("User updated successfully!");
      } else {
        await registerUser(formData);
        setMessage("User created successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          accountId: "",
          email: "",
          roles: [],
        });
      }
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg transition-colors">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        {userId ? "Update User" : "Add User"}
      </h2>

      {message && (
        <p className="text-green-600 dark:text-green-400 mb-2">{message}</p>
      )}
      {error && <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="text"
          name="accountId"
          value={formData.accountId}
          onChange={handleChange}
          placeholder="Account ID"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
          disabled={!!userId}
        />

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Assign Roles
          </label>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-left hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {formData.roles.length > 0
              ? formData.roles.join(", ")
              : "Select roles"}
          </button>

          {dropdownOpen && (
            <div className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
              <div className="sticky top-0 bg-white dark:bg-gray-900 p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {filteredRoles.map((role) => (
                <label
                  key={role.roleId}
                  className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role.name)}
                    className="mr-2 accent-indigo-600"
                    // onChange={() => handleRoleChange(role.name)}
                  />
                  {role.name}
                </label>
              ))}

              {filteredRoles.length === 0 && (
                <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                  No roles found
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading || submitting}
            className="w-1/2 mr-2 py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="w-1/2 py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-all"
          >
            {isEdit ? "Update User" : "Register User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
