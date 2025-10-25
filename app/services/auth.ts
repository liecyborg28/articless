/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/app/utils/api";
import type {
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UserPayload,
} from "@/app/types/auth";

const handleAxiosError = (error: any): never => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  if (error.message) {
    throw new Error(error.message);
  }
  throw new Error("Unknown network error");
};

export const loginUser = async (data: LoginPayload) => {
  try {
    const res = await api.post<UserPayload>("/auth/login", data);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const registerUser = async (data: RegisterPayload) => {
  try {
    const res = await api.post<UserPayload>("/auth/register", data);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const sendResetEmail = async (data: { email: string }) => {
  try {
    const res = await api.post<{ message: string }>("/auth/reset", data);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const resetPassword = async (data: ResetPasswordPayload) => {
  try {
    const res = await api.patch<{ message: string }>("/auth/reset", data);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
