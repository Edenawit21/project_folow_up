import Progress from '@/components/ui/Progress';
import { PieChart } from 'lucide-react';

interface CompletionCardProps {
  completionPercentage: number;
  isLoading?: boolean;
}

const CompletionCard = ({ completionPercentage, isLoading }: CompletionCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <PieChart size={18} />
        <h3 className="font-medium">Completion</h3>
      </div>
      <div className="text-3xl font-bold mb-2">{completionPercentage}%</div>
      <Progress value={completionPercentage} className="h-2" />
    </div>
  );
};

export default CompletionCard;