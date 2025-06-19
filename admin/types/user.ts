export interface UserData {
  data: any;
  roles: string[];
  accountId: string;
  lastName: string;
  firstName: string;
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  active: boolean;
  source: string;
  userId: string;
}

export interface UserResponse {
  success: boolean;
  data: UserData[];
}

export interface UserForm {
  username: string;
  email?: string;
  password?: string;
  role: string;
  value: string;
}

export interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  accountId: string;
  email: string;
  roles: string[];
}

export interface SingleUserResponse {
  success: boolean;
  data: UserData;
}
export interface UpdateUserDto {
  firstName: string;
  lastName: string;
  isActive: boolean;
  accountId: string;
  displayName: string;
  avatarUrl: string;
  timeZone: string;
  currentWorkload: number;
  location: string;
}
