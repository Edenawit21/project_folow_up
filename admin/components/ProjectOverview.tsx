import { ProjectDetailDto } from '@/types/projectDetail';
import { getProjectDetails } from '@/utils/projectDetailApi';
import React, { useState, useEffect } from 'react';

interface ProjectOverallReportProps {
    projectId: string; 
}
    const ProjectOverallReport: React.FC<ProjectOverallReportProps> = ({ projectId }) => {
    const [report, setReport] = useState<ProjectDetailDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReport = async () => {
            setLoading(true);
            setError(null);
            try {

                const data = await getProjectDetails(projectId);

                if (data) {
                    setReport(data);
                } else {
                    setError("Project report not found for this ID.");
                }
            } catch (err: any) {
                setError(err.message || "Failed to load overall project report.");
                console.error("Error loading overall project report:", err);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            loadReport();
        } else {
            setLoading(false);
            setReport(null);
            setError(null);
        }
    }, [projectId]);

    if (loading) return <div className="text-center p-8 text-gray-600">Loading overall project report...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
    if (!report) return <div className="text-center p-8 text-gray-600">No overall project report available for ID: {projectId}.</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-6 lg:p-8">
            <header className="mb-4 py-2 bg-white rounded-lg shadow-md flex flex-col items-center"> 
                <p className="text-lg font-semibold text-gray-800 mb-2 tracking-wide">
                    High-level overview of <span className="text-blue-700 font-bold">"{report.name}"</span> (<span className="text-blue-600">{report.key}</span>) as of <span className="text-gray-700">{new Date().toLocaleDateString()}</span>.
                </p>
                <div className={`mt-2 mb-2 flex items-center px-6 py-2 rounded-full text-lg font-bold border-4 shadow transition-all
                    ${
                        String(report.overallProjectStatus) === "Active"
                            ? "bg-green-100 text-green-800 border-green-100"
                            : String(report.overallProjectStatus) === "OnHold"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-500"
                            : String(report.overallProjectStatus) === "Completed"
                            ? "bg-blue-100 text-blue-800 border-blue-500"
                            : String(report.overallProjectStatus) === "Cancelled"
                            ? "bg-red-100 text-red-800 border-red-500"
                            : String(report.overallProjectStatus) === "Archived"
                            ? "bg-gray-200 text-gray-700 border-gray-400"
                            : "bg-gray-100 text-gray-800 border-gray-400"
                    }
                `}>
                    <span className="mr-1">Status:</span>
                    <span className="uppercase tracking-wider">{report.overallProjectStatus}</span>
                </div>
                {report.lead && (
                    <p className="text-base text-gray-700 mt-1 font-medium">
                        Project Lead: <span className="text-indigo-700 font-semibold">{report.lead}</span>
                    </p>
                )}
            </header>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 items-stretch"> 
                <MetricCard
                    title="Tasks Completion"
                    value={`${report.completedTasks}/${report.totalTasks}`}
                    percentage={
                        report.totalTasks > 0
                            ? (report.completedTasks / report.totalTasks) * 100
                            : 0
                    }
                    color="blue"
                />
                <MetricCard
                    title="Story Points Completion"
                    value={`${report.storyPointsCompleted}/${report.storyPointsTotal}`}
                    percentage={
                        report.storyPointsTotal > 0
                            ? (report.storyPointsCompleted / report.storyPointsTotal) * 100
                            : 0
                    }
                    color="green"
                />
                <MetricCard
                    title="Active Blockers (Total)"
                    value={report.activeBlockers}
                    color="orange"
                />
            </section>

            {/* Executive Summary */}
            {report.executiveSummary && (
                <section className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h2>
                    <p className="text-gray-700">
                        {report.executiveSummary}
                    </p>
                </section>
            )}

            {/* Key Milestones */}
            {report.milestones && report.milestones.length > 0 && (
                <section className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Milestones</h2>
                    <ul className="space-y-3">
                        {report.milestones.map((milestone, index) => (
                            <li key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-md">
                                <div className="font-medium text-gray-800 mb-1 sm:mb-0">{milestone.name}</div>
                                <div className="text-sm text-gray-600 flex items-center">
                                    Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                    <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold
                                        ${milestone.status === 0 ? 'bg-green-200 text-green-800' :
                                            milestone.status === 1 ? 'bg-yellow-200 text-yellow-800' :
                                            milestone.status === 2 ? 'bg-red-200 text-red-800' :
                                            milestone.status === 3 ? 'bg-blue-200 text-blue-800' :
                                            milestone.status === 4 ? 'bg-orange-200 text-orange-800' :
                                            'bg-gray-200 text-gray-800'}`}>
                                            {typeof milestone.status === 'number'
                                                ? ['Planned', 'OnTrack', 'AtRisk','Completed','Delay'][milestone.status] || milestone.status
                                                : milestone.status}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Major Risks */}
            {report.risks && report.risks.length > 0 && (
                <section className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 text-red-700">Major Risks</h2>
                    <ul className="space-y-3">
                        {report.risks.map(risk => (
                            <li key={risk.id} className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-red-50 border-l-4 border-red-400 rounded-md">
                                <span className="font-semibold mr-2 text-red-800 flex-shrink-0">Risk:</span>
                                <p className="text-gray-800 flex-grow">{risk.description}</p>
                                <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0
                                    ${risk.impact === 2 ? 'bg-red-200 text-red-800' :
                                        risk.impact === 1 ? 'bg-orange-200 text-orange-800' :
                                        'bg-gray-200 text-gray-800'}`}>
                                        Impact: {risk.impact === 2 ? 'High' : risk.impact === 1 ? 'Medium' : 'Low'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

    const MetricCard = ({ title, value, percentage, color = 'gray' }: { title: string; value: string | number; percentage?: number; color?: string }) => {
    const borderColorClass = `border-${color}-500`;
    const progressBarColorClass = `bg-${color}-600`;

    return (
        <div className={`bg-white rounded-lg shadow-md p-5 border-l-4 ${borderColorClass}`}> 
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            <p className="text-3xl font-bold text-gray-900">
                {value}
                {percentage !== undefined && percentage !== null && (
                    <span className="ml-2 text-base text-gray-500">({percentage.toFixed(0)}%)</span>
                )}
            </p>
            {percentage !== undefined && percentage !== null && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                        className={`${progressBarColorClass} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
};


export default ProjectOverallReport;