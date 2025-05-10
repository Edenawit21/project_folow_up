import React from "react";
import { Add } from "@mui/icons-material";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  handleOpenDialog: () => void;
}

const Sidebar = ({
  activeSection,
  setActiveSection,
  handleOpenDialog,
}: SidebarProps) => {
  return (
    <aside className="w-60 bg-gray-100 p-6 shadow-md">
      <ul className="space-y-4">
        {["Charts", "Projects"].map((section) => (
          <li
            key={section}
            onClick={() => setActiveSection(section)}
            className={`cursor-pointer ${
              activeSection === section
                ? "font-bold text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {section}
          </li>
        ))}

        {/* + New Project link */}
        <li
          onClick={handleOpenDialog}
          role="button"
          tabIndex={0}
          className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <span className="bg-blue-500 text-white rounded-full p-1">
            <Add fontSize="small" />
          </span>
          New Project
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
