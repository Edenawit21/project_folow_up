export interface UserProject
{
    projectId: string,
    projectKey: string,
    projectName: string,
    totalTasksAssigned: number,
    completedTasks: number,
    totalStoryPointsAssigned: number,
    completedStoryPoints:number,
    taskCompletionPercentage:number,
    storyPointCompletionPercentage: number
  }