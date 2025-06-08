"use client";
import AddProject from "@/components/projects/AddProject";
import { Project } from "@/types";

export default function AddProjectPage() {
  const handleCreate = (data: Project) => {
    console.log("Project Created:", data);
  };

  const handleClose = () => {
    console.log("AddProject closed");
  };

  return <AddProject onCreate={handleCreate} onClose={handleClose} />;
}