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

const AddUser = ({ userId, onClose, onCreate, onUpdate }: AddUserProps) => {
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allRoles = await fetchAllRoles();
        setRoles(allRoles);

        if (userId) {
          const user = await fetchUserById(userId);
          setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            accountId: user.accountId,
            email: user.email || "",
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
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (roleName: string) => {
    setFormData((prev) => {
      const updatedRoles = prev.roles.includes(roleName)
        ? prev.roles.filter((r) => r !== roleName)
        : [...prev.roles, roleName];
      return { ...prev, roles: updatedRoles };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEdit && userId) {
        await updateUser(userId, formData);
        toast.success("User updated successfully!");
        onUpdate();
      } else {
        await registerUser(formData);
        toast.success("User created successfully!");
        onCreate({
          username: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          role: formData.roles.join(", "),
          value: formData.accountId,
        });
        setFormData({
          firstName: "",
          lastName: "",
          accountId: "",
          email: "",
          roles: [],
        });
      }
      onClose(); // Make sure this runs
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Operation failed.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        {isEdit ? "Update User" : "Add User"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
          className="mt-1 w-full px-3 py-2 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          disabled={loading || submitting}
        />

        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
          className="mt-1 w-full px-3 py-2 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          disabled={loading || submitting}
        />

        <input
          type="text"
          name="accountId"
          value={formData.accountId}
          onChange={handleChange}
          placeholder="Account ID"
          required
          className="mt-1 w-full px-3 py-2 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          disabled={loading || submitting}
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          disabled={!!userId || loading || submitting}
          className="mt-1 w-full px-3 py-2 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        />

        {/* Role Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">
            Assign Roles
          </label>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={loading || submitting}
            className="w-full px-4 py-2 border-[1px] rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-left"
          >
            {formData.roles.length > 0
              ? formData.roles.join(", ")
              : "Select roles"}
          </button>

          {dropdownOpen && (
            <div className="absolute z-10 bottom-full  bg-gray-100 dark:bg-gray-800 border  rounded-xl shadow-2xl max-h-60 overflow-y-auto w-full  mb-2">
              <div className="sticky top-0 bg-white dark:bg-gray-900 p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search roles..."
                    className="w-full pl-10 pr-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {filteredRoles.length > 0 ? (
                filteredRoles.map((role) => (
                  <label
                    key={role.roleId}
                    className="flex items-center px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role.name)}
                      onChange={() => handleRoleChange(role.name)}
                      className="mr-2"
                      disabled={loading || submitting}
                    />
                    {role.name}
                  </label>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                  No roles found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading || submitting}
            className="w-1/2 mr-2 py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || loading}
            className="w-1/2 py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            {isEdit ? "Update User" : "Register User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
