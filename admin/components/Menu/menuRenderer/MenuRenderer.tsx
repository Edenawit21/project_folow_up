// components/Menu/MenuRenderer/MenuRenderer.tsx
'use client';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { MenuItem } from '../../../types/menuTypes';

interface MenuRendererProps {
  items: MenuItem[];
  isActive: (path?: string) => boolean;
  expandedItems: Set<string>;
  onToggleExpand: (id: string) => void;
  level?: number;
}

export const MenuRenderer = ({
  items,
  isActive,
  expandedItems,
  onToggleExpand,
  level = 0
}: MenuRendererProps) => {
  // Sort items by their order property if it exists
  const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <ul className={`space-y-1 ${level > 0 ? 'pl-4 mt-1' : ''}`}>
      {sortedItems.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = hasChildren && expandedItems.has(item.id);

        return (
          <li key={item.id} className="relative">
            <div className="flex items-center justify-between group">
              <Link
                href={item.url || '#'}
                className={`flex items-center flex-1 p-2 rounded transition-colors ${
                  isActive(item.url) 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon && (
                  <span className="mr-2 w-5 flex justify-center">
                    {typeof item.icon === 'string' ? (
                      <i className={`${item.icon}`} />
                    ) : (
                      item.icon
                    )}
                  </span>
                )}
                <span>{item.name}</span>
              </Link>

              {hasChildren && (
                <button 
                  onClick={() => onToggleExpand(item.id)}
                  className="p-1 ml-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              )}
            </div>

            {hasChildren && isExpanded && item.children && (
              <MenuRenderer
                items={item.children} // TypeScript now knows item.children exists
                isActive={isActive}
                expandedItems={expandedItems}
                onToggleExpand={onToggleExpand}
                level={level + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};