"use client";

/* eslint-disable react-hooks/rules-of-hooks */
import { useSelector } from "react-redux";
import { RootState } from "../store";

export function PublicGuard({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (localStorage.getItem("user") || user) {
    window.location.href = "/dashboard";
  }

  return <>{children}</>;
}
