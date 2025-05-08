import React from "react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  return (
    <aside className="w-60 bg-gray-100 p-6 shadow-md">
      <ul className="space-y-4">
        {["Projects", "Sprints", "Teams", "Settings"].map((section) => (
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
      </ul>
    </aside>
  );
};

export default Sidebar;
