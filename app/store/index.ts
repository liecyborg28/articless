import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/app/store/slices/auth";
import historyReducer from "@/app/store/slices/history";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    history: historyReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
