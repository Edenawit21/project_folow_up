import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { LayoutDashboard } from 'lucide-react';

// Import Types
import { SprintReport, ProjectSprintOverviewResponse, SprintReportDetail, TaskInSprint } from '@/types/sprint';

// Import Utilities
import { fetchApi, fetchSprint } from '@/utils/sprintApi';

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
import { TasksTable } from '../sprint/TaskTable';
import PriorityBreakdownCard from "@/components/sprint/PriorityBreakdownChart";

interface ProjectDetailProps {
  projectKey: string;
}

const ProjectDetail: NextPage<ProjectDetailProps> = ({ projectKey }) => {
  const [sprintReport, setSprintReport] = useState<SprintReportDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [priorityCounts, setPriorityCounts] = useState<{ [key: string]: number }>({});

  // New state for storing all available sprints and the currently selected sprint ID
  const [availableSprints, setAvailableSprints] = useState<SprintReport[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const projectOverviewData: ProjectSprintOverviewResponse = await fetchApi(projectKey);
        setProjectName(projectOverviewData.projectName);

        if (projectOverviewData.sprints && projectOverviewData.sprints.length > 0) {
          setAvailableSprints(projectOverviewData.sprints);

          let initialSelectedSprint: SprintReport | undefined;

          // Prioritize active sprint
          initialSelectedSprint = projectOverviewData.sprints.find(sprint => sprint.state === 'active');

          // If no active sprint, default to the most recent completed sprint (or the first if no completed ones)
          if (!initialSelectedSprint) {
              const completedSprints = projectOverviewData.sprints
                  .filter(sprint => sprint.state === 'closed')
                  //.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()); // Sort by end date descending
              initialSelectedSprint = completedSprints[0] || projectOverviewData.sprints[0]; // Take most recent completed, or just the very first
          }

          if (initialSelectedSprint) {
            setSelectedSprintId(initialSelectedSprint.id); // Set the initial selected sprint ID
          } else {
            // No sprints found for this project
            setError(`No sprints found for project with key: ${projectKey}`);
            setSprintReport(null);
            setPriorityCounts({});
            setSelectedSprintId(null);
          }
        } else {
          setError(`No sprints found for project with key: ${projectKey}`);
          setSprintReport(null);
          setPriorityCounts({});
          setAvailableSprints([]);
          setSelectedSprintId(null);
        }
      } catch (err: any) {
        console.error("Error fetching project sprint overview:", err);
        setError(err.message || "An unknown error occurred while fetching sprint data.");
        setSprintReport(null);
        setPriorityCounts({});
        setAvailableSprints([]);
        setSelectedSprintId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectKey]); // Depend on projectKey for initial fetch

  // New useEffect to fetch sprint details when selectedSprintId changes
  useEffect(() => {
    const fetchSelectedSprintDetails = async () => {
      if (selectedSprintId) {
        setLoading(true); // Set loading when fetching new sprint details
        setError(null); // Clear previous errors

        try {
          const sprintDetail: SprintReportDetail = await fetchSprint(selectedSprintId);
          console.log("Fetched sprint detail for ID:", selectedSprintId, sprintDetail);

          // Calculate priority counts
          const calculatedPriorityCounts: { [key: string]: number } = {};
          sprintDetail.tasksInSprint?.forEach((task: TaskInSprint) => {
            const priority = task.priority || 'N/A';
            calculatedPriorityCounts[priority] = (calculatedPriorityCounts[priority] || 0) + 1;
          });
          setPriorityCounts(calculatedPriorityCounts);

          setSprintReport({
            ...sprintDetail,
            taskStatusCounts: sprintDetail.taskStatusCounts || {},
            issueTypeCounts: sprintDetail.issueTypeCounts || {},
            developerWorkloads: sprintDetail.developerWorkloads || [],
            recentActivities: sprintDetail.recentActivities || [],
          });
        } catch (err: any) {
          console.error(`Error fetching sprint details for ID ${selectedSprintId}:`, err);
          setError(err.message || "An unknown error occurred while fetching sprint details.");
          setSprintReport(null);
          setPriorityCounts({});
        } finally {
          setLoading(false);
        }
      } else {
        setSprintReport(null); // Clear report if no sprint is selected
        setPriorityCounts({});
      }
    };

    fetchSelectedSprintDetails();
  }, [selectedSprintId]); // Re-run this effect when selectedSprintId changes

  const handleSprintChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSprintId(event.target.value);
  };

  const displayProjectName = projectName || projectKey;

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-inter">
      <div className="max-w-5xl mx-auto">
        <header className="mb-5 rounded-lg p-3 bg-white shadow-md flex items-center justify-between">
  <h1 className="text-2xl font-bold text-gray-800 flex items-center">
    <LayoutDashboard className="inline-block mr-1 h-6 w-6 text-blue-400" /> {/* Reduced icon size slightly */}
    Project Dashboard: <span className="ml-2">{displayProjectName}</span>
  </h1>
  {/* Sprint Filter Dropdown */}
  {availableSprints.length > 0 && (
    <div className="flex items-center space-x-2">
      <label htmlFor="sprint-select" className="text-gray-700 font-medium text-base"> {/* Reduced label font size */}
        Select Sprint:
      </label>
      <select
        id="sprint-select"
        value={selectedSprintId || ''}
        onChange={handleSprintChange}
        className="px-3 py-2 border rounded-md bg-white text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      >
        {availableSprints.map((sprint) => (
          <option key={sprint.id} value={sprint.id}>
            {sprint.name} ({sprint.state})
          </option>
        ))}
      </select>
    </div>
  )}
</header>

        <main>
          {loading && <LoadingSpinner />}
          {error && <ErrorAlert message={error} />}

          {!loading && !error && !sprintReport && (
            <div className="text-center p-8 text-gray-600 text-lg">
              {availableSprints.length === 0
                ? `No sprints found for project with key: ${projectKey}.`
                : "Select a sprint from the dropdown above to view its report."
              }
            </div>
          )}

          {sprintReport && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sprint Summary and Sprint Metrics side-by-side */}
              <div>
                <SprintSummaryCard report={sprintReport} />
              </div>
              <div>
                <SprintMetricsCard report={sprintReport} />
              </div>

              {/* Priority Breakdown and Project Overview side-by-side */}
              <div>
                <PriorityBreakdownCard priorityCounts={priorityCounts} />
              </div>
              <div>
                <ProjectOverviewCharts
                  issueTypeCounts={sprintReport.issueTypeCounts}
                  tasksStatusCounts={sprintReport.taskStatusCounts}
                />
              </div>

              {/* Remaining tables span full width */}
              <div className='lg:col-span-2'>
                <TasksTable tasks={sprintReport.tasksInSprint} />
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
      </div>
    </div>
  );
};

export default ProjectDetail;