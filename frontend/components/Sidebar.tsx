import React from "react";
import { Add } from "@mui/icons-material";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  handleOpenDialog: () => void; // Add the function to handle dialog opening
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
          onClick={handleOpenDialog} // This will open the dialog
          className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <Add className="text-white bg-blue-500"  /> New Project
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
