"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Add } from "@mui/icons-material";
import { Project } from "@/types";
import Sidebar from "@/components/Sidebar";
import ProjectList from "@/components/ProjectList";
import ProjectDialog from "@/components/ProjectDialog";
import { PieChartComponent, BarChartComponent } from "@/components/Charts";
import { projects as initialProjects } from "@/constants";

const teams = ["Team Alpha", "Team Beta", "Team Gamma"];

const ProjectDashboard = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [activeSection, setActiveSection] = useState("Projects");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priority: "",
    status: "",
    team: "",
  });

  const [formData, setFormData] = useState<Omit<Project, "id">>({
    name: "",
    description: "",
    priority: "Medium",
    status: "Not Started",
    dueDate: new Date(),
    team: "",
  });

  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingProject(null);
    setFormData({
      name: "",
      description: "",
      priority: "Medium",
      status: "Not Started",
      dueDate: new Date(),
      team: "",
    });
  }, []);

  const handleDelete = useCallback((projectId: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    }
  }, []);

  const handleSubmit = useCallback(() => {
    const newProject: Project = editingProject
      ? { ...editingProject, ...formData }
      : { ...formData, id: Date.now() };

    setProjects((prev) =>
      editingProject
        ? prev.map((p) => (p.id === editingProject.id ? newProject : p))
        : [...prev, newProject]
    );
    handleCloseDialog();
  }, [editingProject, formData, handleCloseDialog]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="flex-1 p-8">
        {activeSection === "Projects" && (
          <>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <input
                type="text"
                placeholder="Search Projects"
                className="border border-gray-300 rounded px-3 py-2 w-full md:w-72"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="flex flex-wrap gap-2">
                <select
                  value={filters.priority}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  className="border px-3 py-2 rounded bg-white"
                >
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="border px-3 py-2 rounded bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>

                <select
                  value={filters.team}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, team: e.target.value }))
                  }
                  className="border px-3 py-2 rounded bg-white"
                >
                  <option value="">All Teams</option>
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
                onClick={handleOpenDialog}
              >
                <Add className="text-white" />
                New Project
              </button>
            </div>

            {/* Charts Section */}
            <div className="mb-10">
              <h2 className="text-lg font-semibold mb-4">Project Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded shadow">
                  <PieChartComponent projects={projects} />
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <BarChartComponent projects={projects} />
                </div>
              </div>
            </div>

            {/* Project List */}
            <ProjectList
              projects={projects}
              searchTerm={searchTerm}
              filters={filters}
              setEditingProject={setEditingProject}
              setOpenDialog={setOpenDialog}
              handleDelete={handleDelete}
            />
          </>
        )}

        {/* Project Dialog */}
        {openDialog && (
          <ProjectDialog
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            handleCloseDialog={handleCloseDialog}
            editingProject={editingProject}
            teams={teams}
          />
        )}
      </main>
    </div>
  );
};

export default ProjectDashboard;
