"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { login } from "@/utils/auth";
import { toast } from "react-toastify";

type FormState = {
  username: string;
  password: string;
};

type Errors = Partial<FormState>;

const Login = () => {
  const [form, setForm] = useState<FormState>({ username: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!form.username.trim()) newErrors.username = "Username is required.";
    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const data = await login(form);
      console.log("Login API response:", data);

      if (!data?.token) {
        toast.error("Invalid login response from server.");
        return;
      }

      const decoded: any = jwtDecode(data.token);
      console.log("Decoded JWT:", decoded);

      const rolesClaim =
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      const roles = decoded[rolesClaim];

      if (!roles) {
        toast.error("User role information is missing.");
        return;
      }

      const normalizedRoles = Array.isArray(roles)
        ? roles.map((r) => r.toLowerCase())
        : [String(roles).toLowerCase()];

      console.log("Normalized roles:", normalizedRoles);

      if (!normalizedRoles.includes("admin")) {
        toast.error("Access restricted to administrators only.");
        return;
      }

      localStorage.setItem("token", data.token);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="admin"
              className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
