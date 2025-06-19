export interface FormState {
  email: string;
  password: string;
}

// Payload for login requests
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  message: string;
  token: string;
}
