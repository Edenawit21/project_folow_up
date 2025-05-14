"use client";

import React, { useState, useCallback } from "react";
import { Project, Priority, Status } from "@/types";
import Sidebar from "@/components/Sidebar";
import ProjectList from "@/components/ProjectList";
import ProjectDialog from "@/components/ProjectDialog";
import { PieChartComponent, BarChartComponent } from "@/components/Charts";
import ProjectFilters from "@/components/ProjectFilters"; // ✅ imported
import { initialProjects } from "@/constants";

const teams = ["Team Alpha", "Team Beta", "Team Gamma"];

const ProjectDashboard = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeSection, setActiveSection] = useState("Charts");
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
    priority: Priority.Medium,
    status: Status.ToDo,
    team: "",
  });

  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingProject(null);
    setFormData({
      name: "",
      description: "",
      priority: Priority.Medium,
      status: Status.ToDo,
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
    <div className="flex min-h-screen dark:bg-gray-950 text-gray-900 dark:text-white">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleOpenDialog={handleOpenDialog}
      />
      <main className="flex-1 p-8">
        {activeSection === "Projects" && (
          <>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <input
                type="text"
                placeholder="Search Projects"
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded px-3 py-2 w-full md:w-72"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <select
                  value={filters.priority}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priority: e.target.value as Priority,
                    }))
                  }
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded"
                >
                  <option value="">All Priorities</option>
                  <option value={Priority.Urgent}>Urgent</option>
                  <option value={Priority.High}>High</option>
                  <option value={Priority.Medium}>Medium</option>
                  <option value={Priority.Low}>Low</option>
                  <option value={Priority.Backlog}>Backlog</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: e.target.value as Status,
                    }))
                  }
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded"
                >
                  <option value="">All Status</option>
                  <option value={Status.ToDo}>To Do</option>
                  <option value={Status.WorkInProgress}>Work In Progress</option>
                  <option value={Status.UnderReview}>Under Review</option>
                  <option value={Status.Completed}>Completed</option>
                </select>

                <select
                  value={filters.team}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      team: e.target.value,
                    }))
                  }
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded"
                >
                  <option value="">All Teams</option>
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>
            </div>


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

        {activeSection === "Charts" && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4">Project Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 p-4 rounded shadow border dark:border-gray-700">
                <PieChartComponent projects={projects} />
              </div>
              <div className="bg-white dark:bg-gray-900 p-4 rounded shadow border dark:border-gray-700">
                <BarChartComponent projects={projects} />
              </div>
            </div>
          </div>
        )}

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
