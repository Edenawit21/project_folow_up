import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next'; 
import { LayoutDashboard } from 'lucide-react';

// Import Types - Ensure both SprintReport and ProjectSprintOverviewResponse are imported
import { SprintReport, ProjectSprintOverviewResponse } from '@/types/sprint';

// Import Utilities
import { fetchApi } from '@/utils/sprintApi';

// Import UI Components
import LoadingSpinner from '@/components/ProjectsDetails/LoadingSpinner';
import ErrorAlert from '@/components/ProjectsDetails/ErrorAlert';

// Import Chart Components
import ProjectOverviewCharts from '@/components/charts/ProjectOverviewCharts';

// Import Sprint-Specific Components
import SprintSummaryCard from '@/components/sprint/SprintSummaryCard';
import SprintMetricsCard from '@/components/sprint/SprintMetricsCard';
import TeamWorkloadTable from '@/components/sprint/TeamWorkloadTable';
import RecentActivityTable from '@/components/sprint/RecentActivityTable';

// Define props interface for the ProjectDetail component (assuming projectKey is passed as a prop)
interface ProjectDetailProps {
  projectKey: string;
}

// Renamed from Home to ProjectDetail to match your latest structure
const ProjectDetail: NextPage<ProjectDetailProps> = ({ projectKey }) => {
  const [sprintReport, setSprintReport] = useState<SprintReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ProjectName,setProjectName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Clear previous errors

      try {
<<<<<<< HEAD
        // Fetch the entire project overview response
        const projectOverviewData: ProjectSprintOverviewResponse = await fetchApi(projectKey);

        console.log("Raw projectOverviewData from API:", projectOverviewData);
        setProjectName(projectOverviewData.projectName);

        let selectedSprint: SprintReport | undefined;

        // Logic to select the most relevant sprint
        // Prioritize 'active' sprints, otherwise take the first available sprint.
        if (projectOverviewData.sprints && projectOverviewData.sprints.length > 0) {
          selectedSprint = projectOverviewData.sprints.find(sprint => sprint.state === 'active');

          // If no active sprint, default to the first one in the array
          if (!selectedSprint) {
            selectedSprint = projectOverviewData.sprints[0];
          }
        }

        if (selectedSprint) {
          // Normalize the data for the selected sprint before setting state
          setSprintReport({
            ...selectedSprint,
            taskStatusCounts: selectedSprint.taskStatusCounts || {},
            issueTypeCounts: selectedSprint.issueTypeCounts || {},
            developerWorkloads: selectedSprint.developerWorkloads || [],
            recentActivities: selectedSprint.recentActivities || []
          });
        } else {
          // No sprints found for this project
          setError(`No sprints found for project with key: ${projectKey}`);
          setSprintReport(null);
        }

      } catch (err: any) {
        console.error("Error fetching project sprint overview:", err);
        setError(err.message || "An unknown error occurred while fetching sprint data.");
        setSprintReport(null); // Reset report on error
=======
        setIsLoading(true);
        const [projectData, tasksData] = await Promise.all([
          fetchProjectById(projectId),
          fetchTasksByProject(projectId),
        ]);
        console.log("Project Data:", projectData);

        setProject(projectData);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching project data:", error);
>>>>>>> 8971ad81437610fe5c6592e2110e1f782bc0faa3
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectKey]); // Re-run effect if projectKey changes

<<<<<<< HEAD
  // Optional: Display project name/key in the header
  const projectName =  ProjectName || projectKey; // Use boardName if available, else sprint name, else projectKey

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-inter">
      <div className="max-w-5xl mx-auto">
        <header className="mb-5 rounded-lg p-3 bg-white shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            <LayoutDashboard className="inline-block mr-1 h-8 w-8 text-blue-400" />
            Project Dashboard: {projectName}
          </h1>
        </header>

        <main>
          {loading && <LoadingSpinner />}
          {error && <ErrorAlert message={error} />}

          {/* Conditional rendering for sprintReport ensures we only try to access its properties if it's not null */}
          {!loading && !error && !sprintReport && (
            <div className="text-center p-8 text-gray-600 text-lg">
              No sprint report available for this project.
            </div>
          )}

          {sprintReport && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <SprintSummaryCard report={sprintReport} />
              </div>
              <SprintMetricsCard report={sprintReport} />
            <div> {/* You might want to remove the grid if this card spans full width */}
              <ProjectOverviewCharts
                  issueTypeCounts={sprintReport.issueTypeCounts}
                  tasksStatusCounts={sprintReport.taskStatusCounts} />
              </div>
              <div className="lg:col-span-2">
                <TeamWorkloadTable developerWorkloads={sprintReport.developerWorkloads || []} />
              </div>
              <div className="lg:col-span-2">
                <RecentActivityTable recentActivities={sprintReport.recentActivities || []} />
              </div>
            </div>
          )}
        </main>
=======
  if (isLoading || !project) {
    return (
      <div className="grid grid-cols-1 gap-6 p-6 bg-white dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse h-32"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse h-48"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate metrics from tasks
  const statusCounts = calculateStatusDistribution(tasks);
  const priorityCounts = calculatePriorityDistribution(tasks);
  const completionPercentage = calculateCompletion(tasks);
  const activeTasksCount = statusCounts["InProgress"] || 0;
  const overdueTasksCount = countOverdueTasks(tasks);

  const handleBack = () => {
    // Navigation logic
  };

  const handleEdit = () => {
    // Edit logic
  };

  return (
    <div className="grid grid-cols-1 gap-6 p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ProjectHeader
        project={project}
        onBack={handleBack}
        onEdit={handleEdit}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HealthCard health={project.Health} isLoading={isLoading} />
        <ProgressCard
          progress={{
            totalTasks: project.Progress.TotalTasks,
            completedTasks: project.Progress.CompletedTasks,
            storyPointsCompleted: project.Progress.StoryPointsCompleted,
            storyPointsTotal: project.Progress.StoryPointsTotal,
          }}
          isLoading={isLoading}
        />
        <BlockersCard
          activeBlockers={project.Progress.ActiveBlockers}
          recentUpdates={project.Progress.RecentUpdates}
          overdueTasks={overdueTasksCount}
          isLoading={isLoading}
        />
>>>>>>> 8971ad81437610fe5c6592e2110e1f782bc0faa3
      </div>
    </div>
  );
};

export default ProjectDetail;
