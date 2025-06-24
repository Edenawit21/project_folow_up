import React, { useEffect, useState } from "react";
import BreakdownCard from "./BreakdownCard";
import MetricCard from "./MetricsCard";
import { TasksTable } from "../sprint/TaskTable";
import { UserProjectReport, TaskStatus } from '../../types/userReport'; // Make sure TaskStatus is exported from userReport.ts
import { TaskInSprint } from '@/types/sprint'; // Assuming TaskInSprint is correctly imported

// Import the API utility function
import { fetchUserProjectReport } from '../../utils/userReportApi'; // Adjust path based on where you saved api.ts

interface UserProjectReportProps {
  data: UserProjectReport;
  loading: boolean;
  userId: string;
  projectId: string;
}

const UserProjectReportComponent: React.FC<UserProjectReportProps> = ({ userId, projectId }) => {
    // State to hold the fetched report data
    const [reportData, setReportData] = useState<UserProjectReport | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // State for local filtering and search of the tasks list
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [displayedTasks, setDisplayedTasks] = useState<TaskInSprint[]>([]);

    // --- API CALL LOCATION: useEffect hook ---
    useEffect(() => {
        const getReport = async () => {
            setLoading(true); // Start loading
            setError(null);    // Clear any previous errors
            setReportData(null); // Clear previous data
            setDisplayedTasks([]); // Clear tasks

            if (!userId || !projectId) {
                setError("User ID or Project ID is missing.");
                setLoading(false);
                return;
            }

            try {
                // Call the API using the utility function
                const data = await fetchUserProjectReport(userId, projectId);
                setReportData(data);
                // Initialize displayedTasks with all tasks from the fetched report
                setDisplayedTasks(data.userTasksInProject || []);
            } catch (err: any) { // Use 'any' or more specific error type if you have one
                setError(err.message || "An unexpected error occurred while fetching the report.");
            } finally {
                setLoading(false); // End loading
            }
        };

        getReport(); // Execute the async function
    }, [userId, projectId]); // Dependencies: Re-run this effect if userId or projectId changes

    // Effect for local filtering of tasks (depends on fetched reportData and filters)
    useEffect(() => {
        if (!reportData || !reportData.userTasksInProject) {
            setDisplayedTasks([]);
            return;
        }

        const filtered = reportData.userTasksInProject.filter(task => {
            const matchesStatus =
                filterStatus === 'All' || task.status === filterStatus;

            // Use optional chaining (?) for task properties that might be undefined
            const matchesSearch =
                searchTerm === '' ||
                task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                task.description?.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesStatus && matchesSearch;
        });

        setDisplayedTasks(filtered);
    }, [filterStatus, searchTerm, reportData]); // Dependencies: re-filter when filters or reportData changes

    // Defensive checks for loading, error, and no data states
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-700 text-lg">Loading report data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-red-600 text-lg">Error: {error}</p>
                <p className="text-gray-500 text-sm">Please ensure your backend API is running and accessible.</p>
            </div>
        );
    }

    // After loading and error checks, if reportData is still null, it means no data was found or something went wrong
    if (!reportData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-700 text-lg">No report data available for this user and project.</p>
            </div>
        );
    }

    // Destructure reportData once it's confirmed to exist
    const {
        userName,
        projectName,
        totalTasksAssigned,
        completedTasks,
        totalStoryPointsAssigned,
        completedStoryPoints,
        overdueTasks,
        activeBlockers,
        taskCompletionPercentage,
        storyPointCompletionPercentage,
        // userTasksInProject is now managed by `displayedTasks` state for filtering
        taskStatusCounts,
        issueTypeCounts,
        priorityCounts,
        sprintsInvolvedIn
    } = reportData;

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-6 lg:p-8">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                body {
                    font-family: 'Inter', sans-serif;
                }
                `}
            </style>
            <header className="mb-8 p-4 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {userName}'s Report for {projectName}
                </h1>
                <p className="text-gray-600">
                    A comprehensive overview of tasks and progress for this user within the "{projectName}" project.
                </p>
            </header>

            {/* Overall Metrics Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                <MetricCard title="Total Tasks Assigned" value={totalTasksAssigned} color="blue" percentage={0} />
                <MetricCard title="Completed Tasks" value={completedTasks} percentage={taskCompletionPercentage} color="green" />
                <MetricCard title="Total Story Points" value={totalStoryPointsAssigned} color="purple" percentage={0} />
                <MetricCard title="Completed Story Points" value={completedStoryPoints} percentage={storyPointCompletionPercentage} color="teal" />
                <MetricCard title="Overdue Tasks" value={overdueTasks} color="red" percentage={0} />
                <MetricCard title="Active Blockers" value={activeBlockers} color="orange" percentage={0} />
            </section>

            {/* Sprints Involved In Section */}
            {sprintsInvolvedIn && sprintsInvolvedIn.length > 0 && (
                <section className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Sprints Involved In</h2>
                    <div className="flex flex-wrap gap-3">
                        {sprintsInvolvedIn.map(sprint => (
                            <span key={sprint.id} className={`px-4 py-2 rounded-full text-sm font-semibold
                                ${sprint.state === 'active' ? 'bg-blue-100 text-blue-800' :
                                    sprint.state === 'closed' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-700'}`}>
                                {sprint.name} ({sprint.state})
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Task Breakdown Sections */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <BreakdownCard title="Task Status Breakdown" counts={taskStatusCounts} />
                <BreakdownCard title="Issue Type Breakdown" counts={issueTypeCounts} />
                <BreakdownCard title="Priority Breakdown" counts={priorityCounts} />
            </section>

            {/* Filters and Search for Tasks List */}
            <section className="bg-white rounded-lg shadow p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search tasks (Key, Title, Description)"
                    className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    aria-label="Filter tasks by status"
                    className="p-3 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All">All Task Statuses</option>
                    {/* Ensure TaskStatus is an exported enum or object from '../../types/userReport' */}
                    {Object.values(TaskStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <button
                    onClick={() => { setFilterStatus('All'); setSearchTerm(''); }}
                    className="px-6 py-3 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700 transition duration-200 ease-in-out shadow-sm"
                >
                    Reset Task Filters
                </button>
            </section>


            {/* Individual Tasks Section */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Filtered Tasks ({displayedTasks.length})
                </h2>
                {displayedTasks.length > 0 ? (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {/* TasksTable should ideally accept a 'tasks' prop */}
                        <TasksTable tasks={displayedTasks} />
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
                        No tasks found matching your criteria for {userName} in {projectName}.
                    </div>
                )}
            </section>
        </div>
    );
};

export default UserProjectReportComponent;