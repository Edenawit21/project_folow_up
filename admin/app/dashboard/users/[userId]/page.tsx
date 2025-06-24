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
  const { userId } = React.use(params); // unwrap promise

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
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Loading user details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen  dark:bg-gray-800 text-red-600 dark:text-red-400">
        <div className="text-center">
          <p className="text-lg font-semibold">Error: {error}</p>
          <p className="text-sm mt-2">User ID: {userId}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Project not found.
        </p>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-800 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="dark:bg-gray-800 max-w-5xl mx-auto p-6 sm:p-8 transition-colors">
        {selectedProject && selectedProjectId ? (
          <>
            <button
              onClick={handleBackToProjects}
              className="mb-6 inline-flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-xl transition text-base"
            >
              ← Back to Projects
            </button>
            <UserProjectReportComponent
              userId={userId}
              projectId={selectedProjectId}
              data={selectedProject}
              loading={projectLoading}
            />
          </>
        ) : (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-6">
              Assigned Projects Overview
            </h2>
            <div className="overflow-x-auto">
              <ProjectReportTable
                data={project}
                currentUserId={userId}
                onShowMore={handleShowMore}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
