"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensures theme is only applied after hydration
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md hover:scale-110 hover:shadow-lg transition-all duration-200 cursor-pointer"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
