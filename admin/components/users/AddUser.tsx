"use client";

import { useEffect, useState } from "react";
import { RoleData } from "@/types/role";
import { fetchAllRoles } from "@/utils/roleApi";
import { registerUser, fetchUserById, updateUser } from "@/utils/userApi";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import { CreateUserDto, UpdateUserDto, AddUserProps } from "@/types/user";

const AddUser = ({ id, onClose, onCreate, onUpdate }: AddUserProps) => {
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CreateUserDto>({
    firstName: "",
    lastName: "",
    email: "",
    roles: [],
  });

  const [existingUserData, setExistingUserData] =
    useState<UpdateUserDto | null>(null);
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const allRoles = await fetchAllRoles();
        if (!isMounted) return;
        setRoles(allRoles);

        if (id) {
          const user = await fetchUserById(id);
          if (!isMounted) return;
          setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email || "",
            roles: user.roles || [],
          });
          setExistingUserData(user);
        }
      } catch {
        if (isMounted) toast.error("Failed to load data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [id]);

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

  const toastError = (msg: string) => {
    toast.error(msg);
    setSubmitting(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      toast.error("Failed to copy password.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { firstName, lastName, email, roles } = formData;

    if (!firstName.trim()) return toastError("First name is required.");
    if (!lastName.trim()) return toastError("Last name is required.");
    if (!email.trim()) return toastError("Email is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toastError("Please enter a valid email.");
    if (roles.length === 0)
      return toastError("Please assign at least one role.");

    try {
      if (isEdit && id && existingUserData) {
        const updatePayload: UpdateUserDto = {
          firstName,
          lastName,
          email,
          roles,
          displayName: `${firstName} ${lastName}`,
          timeZone: existingUserData.timeZone || "UTC",
          isActive: existingUserData.isActive ?? true,
          location: existingUserData.location || "",
        };

        await updateUser(id, updatePayload);
        toast("User updated successfully!");
        onUpdate();
        onClose();
      } else {
        const createdUser = await registerUser(formData);
        setGeneratedPassword(createdUser.generatedPassword);

        onCreate({
          username: `${firstName} ${lastName}`,
          email,
          role: roles.join(", "),
        });

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          roles: [],
        });
      }

      setDropdownOpen(false);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Operation failed.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          {isEdit ? "Update User" : "Add User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {(["firstName", "lastName", "email"] as const).map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              required
              disabled={(field === "email" && isEdit) || loading || submitting}
              className="mt-1 w-full px-3 py-2 border rounded text-gray-900 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              aria-label={field}
            />
          ))}

          <div className="relative">
            <label
              htmlFor="rolesDropdown"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-center"
            >
              {isEdit ? "Assigned Roles" : "Assign Roles"}
            </label>
            <button
              id="rolesDropdown"
              type="button"
              onClick={() => setDropdownOpen((open) => !open)}
              disabled={loading || submitting}
              className="w-full px-4 py-2 border-[1px] rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-left"
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              {formData.roles.length > 0
                ? formData.roles.join(", ")
                : "Select roles"}
            </button>

            {dropdownOpen && (
              <div
                className="absolute z-10 bottom-full bg-gray-100 dark:bg-gray-800 border rounded-xl shadow-2xl max-h-60 overflow-y-auto w-full mb-2"
                role="listbox"
                aria-multiselectable="true"
              >
                <div className="sticky top-0 bg-white dark:bg-gray-900 p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search roles..."
                      className="w-full pl-10 pr-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      aria-label="Search roles"
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
                        aria-checked={formData.roles.includes(role.name)}
                        role="checkbox"
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

      {/* Modal dialog for generated password */}
      {generatedPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl text-center max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Generated Password
            </h3>
            <div className="flex items-center justify-center mb-4">
              <input
                type="text"
                readOnly
                value={generatedPassword}
                className="w-full px-3 py-2 border rounded text-center text-gray-800 dark:text-white dark:bg-gray-700"
              />
              <button
                onClick={() => copyToClipboard(generatedPassword)}
                className="ml-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                aria-label="Copy password"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <button
              onClick={() => {
                setGeneratedPassword(null);
                onClose(); // Close whole modal
              }}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUser;
