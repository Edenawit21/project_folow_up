import ProjectDetail from "@/components/projectsDetails";
import { fetchProjectTasks, FetchSingleProject } from "@/utils/jira";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { projectKey: string };
}) {
  const key = params.projectKey.toUpperCase();

  try {
    // Fetch both in parallel for better performance
    const [project, tasks] = await Promise.all([
      FetchSingleProject(key),
      fetchProjectTasks(key),
    ]);

    if (!project || !tasks) {
      console.error("Missing data:", { project, tasks });
      return notFound();
    }

    // Stringify and parse to ensure clean serialization
    const cleanProject = JSON.parse(JSON.stringify(project));
    const cleanTasks = JSON.parse(JSON.stringify(tasks));

    return <ProjectDetail project={cleanProject} tasks={cleanTasks} />;
  } catch (error) {
    console.error("Error:", error);
    return notFound();
  }
}