"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { login } from "@/utils/auth";
import { LoginRequest } from "@/types/login";

interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

const Login = () => {
  const router = useRouter();
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    const visitedBefore = sessionStorage.getItem("hasVisitedLogin");
    setIsReturningUser(!!visitedBefore);

    if (!visitedBefore) {
      sessionStorage.setItem("hasVisitedLogin", "true");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Errors = {};
    if (!form.email.trim()) newErrors.email = "Email is required.";
    if (!form.password.trim()) newErrors.password = "Password is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await login(form);

      if (response.requiresPasswordChange) {
        router.push(`/change_password?userId=${response.userId}`);
      } else {
        localStorage.setItem("token", response.token);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrors({ general: err.message || "Login failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md backdrop-blur-md bg-white/70 border border-white/40 shadow-2xl rounded-2xl p-10"
      >
        <h2 className="text-4xl font-extrabold text-center mb-1 text-gray-800"> 
          {isReturningUser ? "Welcome back" : "Welcome"}
        </h2>
        <p className="text-center text-sm text-gray-600 mb-8"> 
          {isReturningUser
            ? "Great to see you again! Please sign in"
            : "Please sign in to your account"}
        </p>

        <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
          {errors.general && (
            <p className="text-red-600 text-sm text-center">{errors.general}</p>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition ${
                errors.email ? "border-red-500" : "border-gray-300"
              } bg-gray-50 text-gray-900`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } bg-gray-50 text-gray-900`}
              />
              <div className="text-sm text-right mt-1">
                <button
                  type="button"
                  onClick={() => router.push("/forgot_password")}
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 mb-4"
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md"
          >
            {loading ? "Logging in..." : "Log In"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;