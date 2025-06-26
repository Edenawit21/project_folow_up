
export enum OverallProjectStatus {
  NotStarted = 0,
  Active = 1,
  OnHold = 2,
  Completed = 3,
  Cancelled = 4,
  Archived = 5,
}


export enum MilestoneStatus {
  Planned = 0,
  OnTrack = 1,
  AtRisk = 2,
  Completed = 3,
  Delayed = 4,
}
// types/projectDetail.ts

export interface UpdateMilestoneDto {
  id: string;
  name: string;
  dueDate: string;
  status: number; // or MilestoneStatus if you prefer
  description: string;
}

export interface AddOrUpdateMilestoneDto {
  name: string;
  dueDate: string;      // ISO date string
  status: MilestoneStatus;
  description: string;
  projectId: string;
}

export interface ProjectDetailDto {
  id: string;
  key: string;
  name: string;
  description: string | null;
  lead: string | null;
  healthLevel: string;
  healthReason: string | null;
  totalTasks: number;
  completedTasks: number;
  storyPointsTotal: number;
  storyPointsCompleted: number;
  activeBlockers: number;
  overallProjectStatus: OverallProjectStatus;
  executiveSummary: string | null;
  ownerName: string | null;
  ownerContactInfo: string | null;
  projectStartDate: string | null;
  targetEndDate: string | null;
  milestones: MilestoneDto[];
  risks: RiskDto[];
}

export interface MilestoneDto {
  id: string;
  name: string;
  dueDate: string; // ISO string
  status: MilestoneStatus;
  description: string | null;
  projectId: string;
}

export interface RiskDto {
  id: string;
  description: string;
  impact: RiskImpact;
  likelihood: RiskLikelihood;
  mitigationPlan: string | null;
  status: RiskStatus;
  projectId: string;
}

export interface ApiResponse<T> {
    isSuccess: boolean;
    isFailed: boolean;
    errors: string[];
    reasons: string[];
    successes: string[];
    value: T;
    valueOrDefault?: T;
}

export interface UpdateProjectStrategicDetailsDto {
  overallStatus: OverallProjectStatus; // enum sent as number
  executiveSummary: string | null;
  ownerName: string | null;
  ownerContact: string | null;
  projectStartDate: string | null; // ISO 8601 format
  targetEndDate: string | null;
}



export enum RiskImpact {
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum RiskLikelihood {
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum RiskStatus {
  Open = 0,
  Mitigated = 1,
  Closed = 2,
}

export interface RiskDto {
  id: string;
  description: string;
  impact: RiskImpact;
  likelihood: RiskLikelihood;
  mitigationPlan: string | null;
  status: RiskStatus;
  projectId: string;
}


export interface AddRiskDto {
  projectId: string;
  description: string;
  impact: RiskImpact;
  likelihood: RiskLikelihood;
  mitigationPlan: string;
  status: RiskStatus;
}

export interface UpdateRiskDto {
  description: string;
  impact: RiskImpact;
  likelihood: RiskLikelihood;
  mitigationPlan: string;
  status: RiskStatus;
}

export interface AddOrUpdateRiskDto {
  description: string;
  impact: RiskImpact;
  likelihood: RiskLikelihood;
  mitigationPlan: string | null;
  status: RiskStatus;
  projectId: string;
}