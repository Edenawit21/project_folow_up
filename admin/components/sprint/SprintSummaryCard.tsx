// src/components/sprint/SprintSummaryCard.tsx
import React from 'react';
import { LayoutDashboard, Calendar, Goal } from 'lucide-react';
import Card from '@/components/ProjectsDetails/Card';
import { formatDate, getProgressColor } from '@/utils/sprintApi';
import { SprintReport, SprintReportDetail } from '@/types/sprint';

interface SprintSummaryCardProps {
  report: SprintReportDetail;
}

const SprintSummaryCard: React.FC<SprintSummaryCardProps> = ({ report }) => {
  // Add a fallback for the report object to prevent further errors if it's undefined
  const { name, startDate, endDate, state, boardName, goal, storyPointCompletionPercentage, taskCompletionPercentage } = report || {};

  const statusColor = state === 'active' ? 'bg-green-100 text-green-700' :
                      state === 'closed' ? 'bg-gray-100 text-gray-700' :
                      'bg-blue-100 text-blue-700';

  return (
    <Card title={`Sprint Summary: ${name || 'N/A'}`} icon={LayoutDashboard}>
      <div className="mb-4 text-gray-700">
        <p className="flex items-center mb-1">
          <Calendar className="h-5 w-5 mr-2 text-gray-500" />
          <span className="font-semibold">Dates:</span> {startDate ? formatDate(startDate) : 'N/A'} - {endDate ? formatDate(endDate) : 'N/A'}
        </p>
        <p className="flex items-center mb-1">
          {state && (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
              {state.charAt(0).toUpperCase() + state.slice(1)}
            </span>
          )}
        </p>
        {goal && (
          <p className="flex items-start mt-2 text-gray-600">
            <Goal className="h-5 w-5 mt-1 mr-2 text-gray-500 flex-shrink-0" />
            <span className="font-semibold">Goal:</span> <span className="ml-1 italic">{goal}</span>
          </p>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Completion Progress</h3>
       <div className="mb-3">
          <p className="text-sm text-gray-600 mb-1">
             Story Points: {(storyPointCompletionPercentage || 0).toFixed(0)}% Completed
         </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${getProgressColor(storyPointCompletionPercentage || 0)}`}
          style={{ width: `${storyPointCompletionPercentage || 0}%` }}>
        </div>
      </div>
    </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Tasks: {(taskCompletionPercentage || 0).toFixed(0)}% Completed</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressColor(taskCompletionPercentage || 0)}`}
              style={{ width: `${taskCompletionPercentage || 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SprintSummaryCard;