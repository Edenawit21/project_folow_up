export interface RoleData {
  roleId: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt?: string;
}

export interface RoleApiResponse {
  value: RoleData[];
  valueOrDefault: RoleData[];
  isFailed: boolean;
  isSuccess: boolean;
  errors: any[];
  successes: any[];
}
