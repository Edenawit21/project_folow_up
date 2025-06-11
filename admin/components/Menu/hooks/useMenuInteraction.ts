// components/Menu/hooks/useMenuInteraction.ts
'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export const useMenuInteraction = () => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const isActive = (path?: string) => {
    if (!path) return false;
    return pathname.startsWith(path) && (path !== '/' || pathname === '/');
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return { isActive, expandedItems, toggleExpand };
};