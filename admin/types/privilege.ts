export interface Permission {
  id: string;
  permissionName: string;
  description?: string;
  action: string;
  createdAt?: string;
}

export interface PermissionApiResponse {
  value: Permission[];
  valueOrDefault: Permission[];
  isFailed: boolean;
  isSuccess: boolean;
  reasons: any[];
  errors: any[];
  successes: any[];
}

export interface PrivilegePayload {
  permissionName: string;
  description: string;
  action: string;
}