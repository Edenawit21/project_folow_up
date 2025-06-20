// src/components/sprint/SprintMetricsCard.tsx
import React from 'react';
import { Gauge, CheckCircle, ClipboardList, AlertCircle, Clock, Flame, Activity } from 'lucide-react';
import Card from '@/components/ProjectsDetails/Card';
import { SprintReport, SprintReportDetail } from '@/types/sprint';

interface SprintMetricsCardProps {
  report: SprintReportDetail;
}

const SprintMetricsCard: React.FC<SprintMetricsCardProps> = ({ report }) => {
  const totalSP = report.totalStoryPoints || 0;
  const completedSP = report.completedStoryPoints || 0;
  const completionPercentage = totalSP > 0 ? (completedSP / totalSP) * 100 : 0;

  // The color class function is also still here, but not used in this component after removal.
  // You can remove it if it's genuinely not used anywhere else.
  const getProgressBarColorClass = (percentage: number) => {
    if (percentage < 30) {
      return 'bg-red-500';
    } else if (percentage < 70) {
      return 'bg-yellow-500';
    } else if (percentage < 100) {
      return 'bg-blue-500';
    } else {
      return 'bg-green-500';
    }
  };

  const metrics = [
    // Ensure these properties exist in your SprintReport type and are provided by the API
    { label: "Story Points", value: `${report.completedStoryPoints || 0} / ${report.totalStoryPoints || 0}`, icon: <CheckCircle className="text-green-600" /> },
    { label: "Tasks", value: `${report.completedTasks || 0} / ${report.totalTasks || 0}`, icon: <ClipboardList className="text-blue-600" /> },
    { label: "Active Blockers", value: report.activeBlockers || 0, icon: <AlertCircle className="text-red-600" /> },
    { label: "Overdue Tasks", value: report.overdueTasks || 0, icon: <Clock className="text-orange-600" /> },
    { label: "Bugs Created", value: report.bugsCreatedThisSprint || 0, icon: <Flame className="text-purple-600" /> },
    { label: "Tasks Moved From Previous", value: report.tasksMovedFromPreviousSprint || 0, icon: <Activity className="text-yellow-600" /> },
  ];

  return (
    <Card title="Sprint Metrics" icon={Gauge}>
      <div className="p-4"> {/* Added padding to the container of the entire card content */}

        {/* Removed: Overall Completion Progress Section was here */}

        {/* Existing Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="p-2 rounded-full bg-white dark:bg-gray-900 shadow-sm mr-3">
                {metric.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.label}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SprintMetricsCard;