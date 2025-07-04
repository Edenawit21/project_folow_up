// "use client";

// import { ChevronDown, ChevronRight } from "lucide-react";
// import { MenuItem } from "@/types/menuTypes";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faFolder,
//   faList,
//   faKey,
//   faUsers,
//   faUserShield,
// } from "@fortawesome/free-solid-svg-icons";

// interface MenuRendererProps {
//   items: MenuItem[];
//   isActive: (path: string | null | undefined) => boolean;
//   expandedItems: Set<number>;
//   onToggleExpand: (id: number) => void;
//   onItemClick: (item: MenuItem) => void;
//   isCollapsed?: boolean;
//   level?: number;
// }

// // Map icon names to FontAwesome icons
// const iconMap: { [key: string]: any } = {
//   projects: faFolder,
//   menu: faList,
//   privileges: faKey,
//   users: faUsers,
//   roles: faUserShield,
// };

// export const MenuRenderer = ({
//   items,
//   isActive,
//   expandedItems,
//   onToggleExpand,
//   onItemClick,
//   isCollapsed = false,
//   level = 0,
// }: MenuRendererProps) => {
//   const sortedItems = [...items].sort(
//     (a, b) => (a.order || 0) - (b.order || 0)
//   );

//   return (
//     <ul className={`space-y-1 ${level > 0 ? "pl-4 mt-1" : ""}`}>
//       {sortedItems.map((item) => {
//         const hasChildren = item.children && item.children.length > 0;
//         const isExpanded = hasChildren && expandedItems.has(item.id);
//         const lowerIcon = item.icon?.toLowerCase();

//         return (
//           <li key={item.id} className="relative">
//             <div className="flex items-center justify-between group">
//               <div
//                 onClick={() => onItemClick(item)}
//                 className={`flex items-center flex-1 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out shadow-sm
//                   ${
//                     isActive(item.url)
//                       ? "text-green-500 dark:text-green-500 font-medium"
//                       : "bg-white dark:bg-transparent text-gray-700 dark:text-gray-300"
//                   }
//                   ${isCollapsed ? "justify-center" : ""}
//                 `}
//               >
//                 <span
//                   className={`${
//                     isCollapsed ? "mx-auto" : "mr-3"
//                   } w-5 flex justify-center`}
//                 >
//                   {lowerIcon && iconMap[lowerIcon] ? (
//                     <FontAwesomeIcon
//                       icon={iconMap[lowerIcon]}
//                       className="w-4 h-4"
//                     />
//                   ) : (
//                     <span className="text-xs">?</span>
//                   )}
//                 </span>
//                 {!isCollapsed && <span className="truncate">{item.name}</span>}
//               </div>

//               {hasChildren && !isCollapsed && (
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onToggleExpand(item.id);
//                   }}
//                   className="ml-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
//                   aria-expanded={isExpanded}
//                 >
//                   {isExpanded ? (
//                     <ChevronDown size={16} />
//                   ) : (
//                     <ChevronRight size={16} />
//                   )}
//                 </button>
//               )}
//             </div>

//             {hasChildren && isExpanded && item.children && !isCollapsed && (
//               <MenuRenderer
//                 items={item.children}
//                 isActive={isActive}
//                 expandedItems={expandedItems}
//                 onToggleExpand={onToggleExpand}
//                 onItemClick={onItemClick}
//                 isCollapsed={isCollapsed}
//                 level={level + 1}
//               />
//             )}
//           </li>
//         );
//       })}
//     </ul>
//   );
// };

"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { MenuItem } from "@/types/menuTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";

interface MenuRendererProps {
  items: MenuItem[];
  isActive: (path: string | null | undefined) => boolean;
  expandedItems: Set<number>;
  onToggleExpand: (id: number) => void;
  onItemClick: (item: MenuItem) => void;
  isCollapsed?: boolean;
  level?: number;
}

// Dynamically get icon by string (e.g., "users" -> faUsers)
const getFontAwesomeIcon = (name: string | undefined | null) => {
  if (!name) return null;

  // Convert "user-shield" → "UserShield"
  const pascalName = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const iconKey = `fa${pascalName}`;
  return (Icons as any)[iconKey] || null;
};

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
        const icon = getFontAwesomeIcon(item.icon?.toLowerCase());

        return (
          <li key={item.id} className="relative">
            <div className="flex items-center justify-between group">
              <div
                onClick={() => onItemClick(item)}
                className={`flex items-center flex-1 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ease-in-out shadow-sm
                  ${
                    isActive(item.url)
                      ? "text-green-500 dark:text-green-500 font-medium"
                      : "bg-white dark:bg-transparent text-gray-700 dark:text-gray-300"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
              >
                <span
                  className={`${
                    isCollapsed ? "mx-auto" : "mr-3"
                  } w-5 flex justify-center`}
                >
                  {icon ? (
                    <FontAwesomeIcon icon={icon} className="w-4 h-4" />
                  ) : (
                    <span className="text-xs text-red-400">?</span>
                  )}
                </span>
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
