export interface TokenModel {
  id: string;
}

export interface RegisterModel {
  email: string;
  password: string;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface LoginWithGoogleModel {
  email: string;
}

export interface ResetPasswordModel {
  id: string;
  password: string;
}
