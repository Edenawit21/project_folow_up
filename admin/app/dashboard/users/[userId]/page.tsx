"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProjectCompletionReports,  } from "@/types/userProject";
import {UserProjectReport} from "@/types/userReport";
import { FetchProjectById, fetchUserProjectReport } from "@/utils/userReportApi";
import ProjectReportTable from "@/components/usertable/ProjectReportTable";
import UserProjectReportComponent from "@/components/usertable/UserProjectReportComponent";

interface PageProps {
  params: Promise<{ userId: string }>; // Type remains the same
}

export default function UserDetailComponent({ params }: PageProps) {
  // Properly unwrap the params promise
  const { userId } = React.use(params); // This is the key fix

  const [project, setProject] = useState<ProjectCompletionReports | null>(null);
  const [selectedProject, setSelectedProject] = useState<UserProjectReport | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);
      try {
        const userData = await FetchProjectById(userId);
        setProject(userData);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        toast.error("Failed to load user details.");
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleShowMore = async (projectId: string) => {
    setSelectedProjectId(projectId);
    setProjectLoading(true);
    try {
      const projectReport = await fetchUserProjectReport(userId, projectId);
      setSelectedProject(projectReport);
    } catch (err) {
      console.error("Failed to fetch project details:", err);
      toast.error("Failed to load project details.");
    } finally {
      setProjectLoading(false);
    }
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setSelectedProjectId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <p>Error: {error}</p>
        <p>User ID: {userId}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Project not found.</p>
      </div>
    );
  }

  return (
   <div className="bg-white p-4 rounded-lg shadow-md mt-4 border border-gray-200 mx-auto w-full overflow-x-auto">
      {selectedProject && selectedProjectId ? (
        <div>
          <button
            onClick={handleBackToProjects}
            className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            ← Back to Projects
          </button>
          <UserProjectReportComponent 
            userId={userId}
            projectId={selectedProjectId}
            data={selectedProject}
            loading={projectLoading}
          />
        </div>
      ) : (
        <>
           <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Assigned Projects Overview
          </h2>
          <ProjectReportTable 
            data={project}  
            currentUserId={userId}
            onShowMore={handleShowMore}
          />
        </>
      )}
    </div>
  );
}