"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppDispatch } from "@/app/redux";  // Your redux hooks path
import { login } from "@/utils";               // Your globalSlice actions path

type FormState = {
  username: string;
  password: string;
};

type Errors = {
  username?: string;
  password?: string;
};

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<FormState>({ username: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Errors = {};
    if (!form.username.trim()) newErrors.username = "Username is required.";
    if (!form.password.trim()) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Here you would add real authentication logic
    // For demo, assume login is successful:

    dispatch(login());        // Set isLoggedIn to true in redux store
    router.push("/projects/project_list"); // Redirect after login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl p-10 border border-green-100"
        style={{
          boxShadow: "0 4px 24px rgba(0, 132, 61, 0.2)",
        }}
      >
        <h2 className="text-4xl font-bold text-center mb-8 text-black dark:text-white">
          Welcome
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className={`w-full px-4 py-2 text-base rounded-md border ${
                errors.username
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 transition`}
            />
            {errors.username && (
              <p className="text-red-600 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2 text-base rounded-md border ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 transition`}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}

            <div className="mt-2 text-right">
              <span
                onClick={(e) => e.preventDefault()}
                className="text-sm text-green-700 hover:underline dark:text-green-400 cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-2 px-4 text-base bg-[#00843D] hover:bg-[#006E33] text-white font-semibold rounded-md transition duration-200"
          >
            Log In
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
