/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  sendResetEmail,
  resetPassword,
} from "@/app/services/auth";
import {
  AuthState,
  LoginPayload,
  RegisterPayload,
  ResetEmailPayload,
  ResetPasswordPayload,
} from "@/app/types/auth";

const initialState: AuthState = {
  user: null,
  loading: false,
  error: false,
  success: false,
  message: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await loginUser(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await registerUser(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const sendReset = createAsyncThunk(
  "auth/sendReset",
  async (data: ResetEmailPayload, { rejectWithValue }) => {
    try {
      const res = await sendResetEmail(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const resetPass = createAsyncThunk(
  "auth/resetPass",
  async (data: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      const res = await resetPassword(data);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = false;
      state.success = false;
      state.message = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },

    clearError: (state) => {
      state.error = false;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = false;
          state.message = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/fulfilled"),
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.success = true;

          state.user = action.payload?.data || null;
          state.message = action.payload?.message || null;

          if (state.user && typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(state.user));
            window.location.href = "/dashboard";
          }
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.loading = false;
          state.error = true;
          state.message = action.payload || null;
        }
      );
  },
});

export const { logout, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
