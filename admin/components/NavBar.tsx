// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { Menu, Moon, Sun, User, LogOut } from "lucide-react";
// import Link from "next/link";
// import { useAppDispatch, useAppSelector } from "@/app/redux";
// import { setIsDarkMode, setIsSidebarCollapsed } from "@/utils";
// import Image from "next/image";
// import { logout } from "@/utils/logout";

// const Navbar = () => {
//   const dispatch = useAppDispatch();
//   const isSidebarCollapsed = useAppSelector(
//     (state) => state.global.isSidebarCollapsed
//   );
//   const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

//   const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
//   const accountRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         accountRef.current &&
//         !accountRef.current.contains(event.target as Node)
//       ) {
//         setIsAccountMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <header className="flex items-center justify-between px-4 py-3 shadow-sm bg-white/80 backdrop-blur-sm dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300 dark:shadow-">
//       {/* Left: Sidebar Toggle & Logo */}
//       <div className="flex items-center gap-6">
//         {isSidebarCollapsed && (
//           <>
//             <button
//               aria-label="Open Sidebar"
//               onClick={() => dispatch(setIsSidebarCollapsed(false))}
//               className="p-2 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
//             >
//               <Menu className="h-6 w-6 text-gray-700 dark:text-white" />
//             </button>

//             <Image
//               src="/logo.png"
//               alt="Logo"
//               width={70}
//               height={50}
//               className="animate-fadeIn"
//             />
//           </>
//         )}
//       </div>

//       {/* Right: Theme Toggle & User */}
//       <div className="flex items-center gap-4 relative">
//         {/* Theme Toggle */}
//         <button
//           onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
//           aria-label="Toggle Theme"
//           className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm"
//         >
//           {isDarkMode ? (
//             <Sun className="h-5 w-5 text-yellow-400" />
//           ) : (
//             <Moon className="h-5 w-5 text-blue-500" />
//           )}
//         </button>

//         {/* Divider */}
//         <div className="hidden md:block h-6 w-px mx-2 bg-gray-300 dark:bg-gray-600" />

//         {/* User Dropdown */}
//         <div
//           ref={accountRef}
//           className="relative hidden md:flex items-center justify-center"
//         >
//           <button
//             onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
//             className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all shadow-sm"
//             aria-label="Account Menu"
//           >
//             <User className="h-6 w-6 cursor-pointer text-gray-700 dark:text-white" />
//           </button>

//           {/* Dropdown Menu */}
//           {isAccountMenuOpen && (
//             <div className="absolute right-0 top-12 w-44 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 backdrop-blur-md animate-fadeInUp overflow-hidden">
//               <button
//                 onClick={logout}
//                 className="flex gap-1 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
//               >
//                 <LogOut className="h-4 w-5 text-red-600 dark:text-red-500" />
//                 <p className="text-red-600 dark:text-red-500"> Logout</p>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

// Navbar.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, Moon, Sun, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/utils";
import Image from "next/image";
import { logout } from "@/utils/logout";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 py-3 shadow-sm bg-white/80 backdrop-blur-sm dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300">
      {/* Left: Sidebar Toggle & Logo */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Always show expand button on large screens when sidebar is collapsed */}
        {!isMobile && isSidebarCollapsed && (
          <button
            aria-label="Expand Sidebar"
            onClick={() => dispatch(setIsSidebarCollapsed(false))}
            className="p-1.5 sm:p-2 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-white" />
          </button>
        )}

        {/* Show expand button on mobile when sidebar is collapsed */}
        {isMobile && isSidebarCollapsed && (
          <button
            aria-label="Expand Sidebar"
            onClick={() => dispatch(setIsSidebarCollapsed(false))}
            className="p-1.5 sm:p-2 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-white" />
          </button>
        )}

        {/* Logo - Show when sidebar is collapsed OR on mobile */}
        {(isSidebarCollapsed || isMobile) && (
          <Image
            src="/logo.png"
            alt="Logo"
            width={isMobile ? 60 : 70}
            height={40}
            className="animate-fadeIn"
            
          />
        )}
      </div>

      {/* Right: Theme Toggle & User */}
      <div className="flex items-center gap-2 sm:gap-4 relative">
        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          aria-label="Toggle Theme"
          className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
          ) : (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
          )}
        </button>

        {/* Divider - Hidden on mobile */}
        <div className="h-6 w-px mx-1 sm:mx-2 bg-gray-300 dark:bg-gray-600 hidden sm:block" />

        {/* User Dropdown */}
        <div
          ref={accountRef}
          className="relative flex items-center justify-center"
        >
          <button
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all shadow-sm"
            aria-label="Account Menu"
          >
            <User className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer text-gray-700 dark:text-white" />
          </button>

          {/* Dropdown Menu */}
          {isAccountMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 backdrop-blur-md animate-fadeInUp overflow-hidden">
              <button
                onClick={logout}
                className="flex gap-2 items-center w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                <LogOut className="h-4 w-4 text-red-600 dark:text-red-500" />
                <span className="text-red-600 dark:text-red-500">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;