/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

export interface History {
  id: string;
  user_id: string;
  text: string;
  created_at?: string;
  updated_at?: string;
}

interface HistoryState {
  items: History[];
  loading: boolean;
  error: string | null;
}

const initialState: HistoryState = {
  items: [],
  loading: false,
  error: null,
};

// --- Helper untuk ambil token dari localStorage ---
function getToken() {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null;
    const parsed = JSON.parse(user);
    return parsed?.token || null;
  } catch {
    return null;
  }
}

// --- Async Thunks ---
export const fetchHistories = createAsyncThunk(
  "history/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data as History[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch histories"
      );
    }
  }
);

export const createHistory = createAsyncThunk(
  "history/create",
  async (text: string, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.post(
        `${API_URL}/history`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data.histories as History[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create history"
      );
    }
  }
);

export const deleteHistory = createAsyncThunk(
  "history/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = getToken();
      const res = await axios.delete(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });
      return res.data.data.histories as History[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete history"
      );
    }
  }
);

// --- Slice ---
const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchHistories.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchHistories.fulfilled,
        (state, action: PayloadAction<History[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchHistories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        createHistory.fulfilled,
        (state, action: PayloadAction<History[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(createHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        deleteHistory.fulfilled,
        (state, action: PayloadAction<History[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(deleteHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default historySlice.reducer;
