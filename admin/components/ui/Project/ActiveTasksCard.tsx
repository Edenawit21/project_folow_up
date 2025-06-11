import { Activity } from 'lucide-react';

interface ActiveTasksCardProps {
  activeTasksCount: number;
  isLoading?: boolean;
}

const ActiveTasksCard = ({ activeTasksCount, isLoading }: ActiveTasksCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Activity size={18} />
        <h3 className="font-medium">Active Tasks</h3>
      </div>
      <div className="text-3xl font-bold">{activeTasksCount}</div>
    </div>
  );
};

export default ActiveTasksCard;