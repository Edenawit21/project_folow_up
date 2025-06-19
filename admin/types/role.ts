export interface Role {
  createdAt?: string;
  name: string;
  description?: string;
  permissions: string[];
 
}

export interface RoleData {
  roleId: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt?: string;
}

export interface RoleApiResponse {
 success:boolean;
 data:Role | Role[];
}

