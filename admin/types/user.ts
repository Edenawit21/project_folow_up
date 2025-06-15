export interface User {
  accountId: string;
  lastName: string;
  firstName: string;
  id: string;
  Username: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  active: boolean;
  source: string;
  userId: string;
}

export interface UserResponse {
  success: boolean;
  data: User[];
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
