"use client";

import { useMenu } from "@/components/Menu/hooks/useMenu";
import { MenuRenderer } from "./MenuRenderer";
import { MenuItem } from "@/types/menuTypes";

export const MenuContainer = ({
  initialData,
}: {
  initialData?: MenuItem[];
  isCollapsed?: boolean;
}) => {
  const { menuData, loading, error, isActive, expandedItems, toggleExpand } =
    useMenu(initialData);
  if (loading) return <LoadingSpinner className="my-8" />;
  if (error)
    return (
      <ErrorMessage
        message="Failed to load menu"
        retry={() => window.location.reload()}
      />
    );
  return (
    <MenuRenderer
      items={menuData}
      isActive={isActive}
      expandedItems={expandedItems}
      onToggleExpand={toggleExpand}
    />
  );
};
// Spinner Component
const LoadingSpinner = ({ className = "" }: { className?: string }) => (
  <div className={`flex justify-center items-center ${className}`}>
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500 dark:border-white" />
  </div>
);

// Error Message Component
const ErrorMessage = ({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) => (
  <div className="text-center text-red-600 dark:text-red-400 my-4">
    <p>{message}</p>
    {retry && (
      <button
        onClick={retry}
        className="mt-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        Retry
      </button>
    )}
  </div>
);
