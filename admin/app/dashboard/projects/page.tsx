import { ProjectTable } from '@/components/projects/projectTable';

export default function ProjectsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      <ProjectTable />
    </div>
  );
}