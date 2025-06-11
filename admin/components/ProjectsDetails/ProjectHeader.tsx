import { FolderKanban, Users, ChevronLeft, Edit ,AlertTriangle } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface ProjectHeaderProps {
  project: {
    Key: string;
    Name: string;
    Description: string;
    Lead: string;
    Critical: boolean;
  };
  onBack?: () => void;
  onEdit?: () => void;
}

const ProjectHeader = ({ project, onBack, onEdit }: ProjectHeaderProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <FolderKanban className="text-blue-600" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{project.Name}</h1>
              <Badge variant="outline" className="text-sm">{project.Key}</Badge>
              {project.Critical && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle size={14} /> Critical
                </Badge>
              )}
            </div>
            <p className="text-gray-500 mt-1">{project.Description}</p>
            <div className="flex gap-4 mt-3">
              <span className="text-sm text-gray-600 flex items-center">
                <Users className="mr-1" size={14} /> Lead: {project.Lead}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onBack}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft size={16} className="mr-1" /> Back to Projects
          </button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={onEdit}
          >
            <Edit size={14} /> Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;