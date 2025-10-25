"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export function PublicGuard({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser || user) {
        window.location.href = "/dashboard";
      }
    }
  }, [user]);

  return <>{children}</>;
}
