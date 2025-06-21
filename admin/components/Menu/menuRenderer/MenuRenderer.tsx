"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { MenuItem } from "@/types/menuTypes";

interface MenuRendererProps {
  items: MenuItem[];
  isActive: (path: string | null | undefined) => boolean;
  expandedItems: Set<number>;
  onToggleExpand: (id: number) => void;
  onItemClick: (item: MenuItem) => void;
  isCollapsed?: boolean;
  level?: number;
}

export const MenuRenderer = ({
  items,
  isActive,
  expandedItems,
  onToggleExpand,
  onItemClick,
  isCollapsed = false,
  level = 0,
}: MenuRendererProps) => {
  const sortedItems = [...items].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  return (
    <ul className={`space-y-1 ${level > 0 ? "pl-4 mt-1" : ""}`}>
      {sortedItems.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = hasChildren && expandedItems.has(item.id);

        return (
          <li key={item.id} className="relative">
            <div className="flex items-center justify-between group">
              <div
                onClick={() => onItemClick(item)}
                className={`flex items-center flex-1 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out shadow-sm
                  ${
                    isActive(item.url)
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 font-medium"
                      : "bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
              >
                {item.icon && (
                  <span
                    className={`${
                      isCollapsed ? "mx-auto" : "mr-3"
                    } w-5 flex justify-center`}
                  >
                    {typeof item.icon === "string" ? (
                      <i className={`${item.icon}`} />
                    ) : (
                      item.icon
                    )}
                  </span>
                )}
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </div>

              {hasChildren && !isCollapsed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand(item.id);
                  }}
                  className="ml-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              )}
            </div>

            {hasChildren && isExpanded && item.children && !isCollapsed && (
              <MenuRenderer
                items={item.children}
                isActive={isActive}
                expandedItems={expandedItems}
                onToggleExpand={onToggleExpand}
                onItemClick={onItemClick}
                isCollapsed={isCollapsed}
                level={level + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};
