"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProjectCompletionReports } from "@/types/userProject";
import { UserProjectReport } from "@/types/userReport";
import {
  FetchProjectById,
  fetchUserProjectReport,
} from "@/utils/userReportApi";
import ProjectReportTable from "@/components/usertable/ProjectReportTable";
import UserProjectReportComponent from "@/components/usertable/UserProjectReportComponent";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default function UserDetailComponent({ params }: PageProps) {
  const { userId } = React.use(params); // Still assuming `params` is a Promise, but this line may need to be `await params` in `useEffect`

  const [project, setProject] = useState<ProjectCompletionReports | null>(null);
  const [selectedProject, setSelectedProject] =
    useState<UserProjectReport | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
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
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-800 dark:text-white">
        <p className="text-gray-600 dark:text-gray-300">
          Loading user details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 dark:bg-gray-800 dark:text-red-400">
        <div>
          <p>Error: {error}</p>
          <p>User ID: {userId}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-800 dark:text-white">
        <p className="text-gray-600 dark:text-gray-300">Project not found.</p>
      </div>
    );
  }

  return (
<<<<<<< features/MenuRenderer
   <div className="bg-white p-4 rounded-lg shadow-md mt-4 border border-gray-200 mx-auto w-full overflow-x-auto">
=======
    <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md mt-8 border border-gray-200 dark:border-gray-700 mx-auto max-w-4xl w-full">
>>>>>>> main
      {selectedProject && selectedProjectId ? (
        <div>
          <button
            onClick={handleBackToProjects}
            className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
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
<<<<<<< features/MenuRenderer
           <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
=======
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
>>>>>>> main
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
