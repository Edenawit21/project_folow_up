"use client";
import AddProject from "@/components/projects/AddProject";
import { Project } from "@/types";

export default function AddProjectPage() {
  const handleCreate = (data: Project) => {
    console.log("Project Created:", data);
    // Here you could call an API or update state
  };

  const handleClose = () => {
    console.log("AddProject closed");
    // e.g., router.push("/projects") if you want to navigate
  };

  return <AddProject onCreate={handleCreate} onClose={handleClose} />;
}
