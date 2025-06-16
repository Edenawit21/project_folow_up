export interface RoleData {
  createdAt: string;
  name: string;
  description: string;
  permissions: string[];
  roleId: string;
}

export interface RoleApiResponse {
  success: boolean;
  data: RoleData[];
}

export interface RolePayload {
  name: string;
  description: string;
  permissionIds: string[];
}

export interface RoleUpdatePayload {
  name: string;
  description: string;
  permissionsToAdd: string[];
}

export interface CreateRoleProps {
  id?: string;
  onClose: () => void;
  onCreate?: (data: RolePayload) => void;
  onUpdate?: (data: RoleUpdatePayload) => void;
}
