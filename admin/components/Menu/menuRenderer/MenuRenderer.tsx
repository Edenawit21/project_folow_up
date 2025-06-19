'use client';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { MenuItem } from '@/types/menuTypes';

interface MenuRendererProps {
  items: MenuItem[];
  // FIX: Update isActive to accept string | null | undefined
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
  level = 0
}: MenuRendererProps) => {
  const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));

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
                className={`flex items-center flex-1 p-2 rounded transition-colors cursor-pointer ${
                  isActive(item.url) // This line will no longer have a redline
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                {item.icon && (
                  <span className={`${isCollapsed ? 'mx-auto' : 'mr-2'} w-5 flex justify-center`}>
                    {typeof item.icon === 'string' ? (
                      <i className={`${item.icon}`} />
                    ) : (
                      item.icon
                    )}
                  </span>
                )}
                {!isCollapsed && <span>{item.name}</span>}
              </div>

              {hasChildren && !isCollapsed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpand(item.id);
                  }}
                  className="p-1 ml-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
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
                level={level + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};
