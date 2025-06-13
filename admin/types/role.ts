export interface RoleData {
  roleId: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt?: string;
}

export interface RoleApiResponse {
  success: boolean;
  data: RoleData[];
}
export interface RolePayload {
  name: string;
  description?: string;
  permissions: string[];
}
