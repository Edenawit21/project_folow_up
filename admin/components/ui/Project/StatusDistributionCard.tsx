import Badge from '@/components/ui/Badge';
import { PieChart } from 'lucide-react';

interface StatusDistributionCardProps {
  statusCounts: Record<string, number>;
  isLoading?: boolean;
}

const StatusDistributionCard = ({ statusCounts, isLoading }: StatusDistributionCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <PieChart size={18} />
        <h3 className="font-medium">Status Distribution</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="flex items-center justify-between p-3 border rounded">
            <span className="text-sm capitalize">{status}</span>
            <Badge variant={status === 'Done' ? 'success' : 'outline'}>
              {count}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusDistributionCard;