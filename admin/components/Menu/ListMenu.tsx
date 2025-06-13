"use client"
import React from "react";
import { MenuItem } from "@/types/menuTypes";

interface ListMenuProps {
  items: MenuItem[];
}

const ListMenu: React.FC<ListMenuProps> = ({ items }) => {
  // Sort by order (optional chaining in case order is undefined)
  const sortedItems = [...items].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return (
    <ul>
      {sortedItems.map((item) => (
        <li key={item.id} style={{ marginBottom: "1rem" }}>
          {/* Render icon as string classname or ReactNode */}
          {typeof item.icon === "string" ? (
            <i className={item.icon} style={{ marginRight: 6 }}></i>
          ) : (
            item.icon
          )}
          {/* Show link if URL exists, else just name */}
          {item.url ? (
            <a href={item.url} style={{ marginRight: 8 }}>
              {item.name}
            </a>
          ) : (
            <span style={{ marginRight: 8 }}>{item.name}</span>
          )}

          {item.requiredPrivilege && (
            <span>Privilege: {item.requiredPrivilege} | </span>
          )}
          <span>Parent ID: {item.parentId}</span>

          {/* Recursively render children if present */}
          {item.children && item.children.length > 0 && (
            <ListMenu items={item.children} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default ListMenu;
