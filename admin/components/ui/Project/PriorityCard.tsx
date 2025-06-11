import Badge from '@/components/ui/Badge';
import { Flag } from 'lucide-react';

interface PriorityCardProps {
  priorityCounts: Record<string, number>;
  isLoading?: boolean;
}

const PriorityCard = ({ priorityCounts, isLoading }: PriorityCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Flag size={18} />
        <h3 className="font-medium">Priority Breakdown</h3>
      </div>
      <div className="space-y-2">
        {Object.entries(priorityCounts).map(([priority, count]) => (
          <div key={priority} className="flex items-center justify-between">
            <span className="text-sm capitalize">{priority}</span>
            <Badge variant="outline">{count}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityCard;