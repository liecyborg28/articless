export interface UserPayload {
  user_id: string;
  full_name: string;
  email: string;
  password: string;
  token: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetEmailPayload {
  email: string;
}

export interface ResetPasswordPayload {
  id: string;
  password: string;
}

export interface AuthState {
  user: UserPayload | null;
  loading: boolean;
  error: boolean;
  success: boolean;
  message: string | null;
}
