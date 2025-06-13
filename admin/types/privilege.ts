export interface Permission {
  id: string;
  permissionName: string;
  description?: string;
  action: string;
  createdAt?: string;
}

export interface PermissionApiResponse {
  success: boolean;
  data: Permission[];
}


export interface PrivilegePayload {
  permissionName: string;
  description: string;
  action: string;
}