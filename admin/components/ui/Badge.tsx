import { AlertTriangle, CheckCircle, AlertCircle, Clock } from "lucide-react";
import React from "react";

interface BadgeProps {
  variant?: "default" | "destructive" | "success" | "warning" | "outline";
  children: React.ReactNode;
  className?: string;
}

const Badge = ({
  variant = "default",
  children,
  className = "",
}: BadgeProps) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400",
    outline:
      "border border-gray-300 bg-white text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200",
  };

  // Optional icon by variant (you can adjust or remove icons as needed)
  const icons = {
    destructive: <AlertTriangle className="mr-1 w-3 h-3" />,
    success: <CheckCircle className="mr-1 w-3 h-3" />,
    warning: <AlertCircle className="mr-1 w-3 h-3" />,
    default: null,
    outline: null,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {icons[variant]}
      {children}
    </span>
  );
};

export default Badge;
