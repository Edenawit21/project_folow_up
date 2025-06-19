'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowUpDown, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  Plus,
  Search
} from 'lucide-react'
import { fetchProjects, ProjectDto } from '../../utils/Jira';
import  ViewProjectButton  from '../ui/ViewProjectButton'

// Progress Bar Component
const Progress = ({ value, className }: { value: number; className?: string }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-blue-600 h-2 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

// Badge Component
const Badge = ({ 
  variant = 'default', 
  children,
  className = ''
}: {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  children: React.ReactNode;
  className?: string;
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Button Component
// const Button = ({ 
//   variant = 'default',
//   size = 'default',
//   children,
//   className = '',
//   ...props
// }: {
//   variant?: 'default' | 'ghost' | 'outline';
//   size?: 'default' | 'sm' | 'lg';
//   children: React.ReactNode;
//   className?: string;
//   [key: string]: any;
// }) => {
//   const variantClasses = {
//     default: 'bg-blue-600 text-white hover:bg-blue-700',
//     ghost: 'hover:bg-gray-100',
//     outline: 'border border-gray-300 hover:bg-gray-50'
//   };

//   const sizeClasses = {
//     default: 'px-4 py-2 text-sm',
//     sm: 'px-3 py-1 text-xs',
//     lg: 'px-6 py-3 text-base'
//   };

//   return (
//     <button
//       className={`rounded-md font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// Input Component
const Input = ({ className = '', ...props }: { className?: string; [key: string]: any }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

// Select Components
const Select = ({ children, value, onValueChange }: { children: React.ReactNode; value: string; onValueChange: (value: string) => void }) => {
  return (
    <div className="relative">
      {children}
    </div>
  );
};

const SelectTrigger = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </div>
  );
};

const SelectValue = ({ placeholder }: { placeholder: string }) => {
  return <span className="text-muted-foreground">{placeholder}</span>;
};

const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover shadow-md animate-in fade-in-80">
      {children}
    </div>
  );
};

const SelectItem = ({ children, value }: { children: React.ReactNode; value: string }) => {
  return (
    <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
      {children}
    </div>
  );
};

export const ProjectTable = () => {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    healthLevel: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const getHealthBadge = (level: number) => {
    switch(level) {
      case 1: return <Badge variant="success">On Track</Badge>;
      case 2: return <Badge variant="warning">Need Attension</Badge>;
      case 3: return <Badge variant="destructive">Critical</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const getHealthLevel = (healthReason: string) => {
    if (healthReason.toLowerCase().includes('on track')) return 1;
    if (healthReason.toLowerCase().includes('attention')) return 2;
    if (healthReason.toLowerCase().includes('critical')) return 3;
    return 0;
  };

  const filteredProjects = projects.filter(project => {
    const healthLevel = getHealthLevel(project.Health.Reason);
    
    return (
      (filters.healthLevel === '' || healthLevel.toString() === filters.healthLevel) &&
     // (filters.status === '' || project.Critical === filters.status) &&
      (filters.search === '' || 
       project.Name.toLowerCase().includes(filters.search.toLowerCase()) ||
       project.Key.toLowerCase().includes(filters.search.toLowerCase()) ||
       (project.Lead && project.Lead.toLowerCase().includes(filters.search.toLowerCase())))
    );
  });

  if (loading) {
    return <div className="p-4 text-center">Loading projects...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4 p-4">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                setFilters({...filters, search: e.target.value})
            }
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            value={filters.healthLevel}
            onValueChange={(value) => setFilters({...filters, healthLevel: value})}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Health" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="1">On Track</SelectItem>
              <SelectItem value="2">Needs Attention</SelectItem>
              <SelectItem value="3">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({...filters, status: value})}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="on_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left w-[30%]">Project</th>
              <th className="p-4 text-left">Lead</th>
              <th className="p-4 text-left">Health</th>
              <th className="p-4 text-left">Progress</th>
              <th className="p-4 text-left">Story Points</th>
              <th className="p-4 text-left">Blocker</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <tr key={project.Id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{project.Name}</div>
                    <div className="text-sm text-gray-500">
                      {project.Key}
                    </div>
                  </td>
                  <td className="p-4">{project.Lead}</td>
                  <td className="p-4">
                    {getHealthBadge(project.Health.Level)}
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="text-sm">
                        {project.Progress.CompletedTasks} / {project.Progress.TotalTasks} tasks
                      </div>
                      <Progress 
                        value={
                          (project.Progress.CompletedTasks / project.Progress.TotalTasks) * 100
                        } 
                        className="h-2"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    {project.Progress.StoryPointsCompleted} / {project.Progress.StoryPointsTotal} SP
                  </td>
                  <td className="p-4">
                    {project.Progress.ActiveBlockers > 0 ? (
                      <Badge variant="destructive">
                        {project.Progress.ActiveBlockers} blocker{project.Progress.ActiveBlockers !== 1 ? 's' : ''}
                      </Badge>
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <ViewProjectButton projectKey={project.Key} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No projects found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};