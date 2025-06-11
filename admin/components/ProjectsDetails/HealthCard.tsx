import { Gauge } from 'lucide-react';
import Progress from '../ui/Progress';
import Badge from '../ui/Badge';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../ui/Collapsible';

interface HealthCardProps {
  health: {
    Level: number;
    Reason: string;
    Score: number;
    Confidence: string;
  } ;
  isLoading?: boolean;
}

const getHealthVariant = (level: number) => {
  switch(level) {
    case 1: return 'success';
    case 2: return 'warning';
    case 3: return 'destructive';
    default: return 'default';
  }
};

const getHealthStatusText = (level: number) => {
  switch(level) {
    case 1: return 'On Track';
    case 2: return 'Needs Attention';
    case 3: return 'Critical';
    default: return 'Unknown';
  }
};

const HealthCard = ({ health , isLoading}: HealthCardProps) => {
     if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <Gauge size={18} /> Project Health
        </h3>
        <Badge variant={getHealthVariant(health.Level)}>
          {getHealthStatusText(health.Level)}
        </Badge>
      </div>
      <Progress value={health.Score * 100} className="h-2 mb-2" />
      <p className="text-sm text-gray-600 mb-1">
        Confidence: <span className="font-medium">{health.Confidence}</span>
      </p>
      <Collapsible>
        <CollapsibleTrigger className="text-sm text-blue-600 hover:underline">
          {health.Reason}
        </CollapsibleTrigger>
        <CollapsibleContent className="text-sm text-gray-600 mt-1">
          {health.Reason}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default HealthCard;