"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function PrivateGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/auth/login");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [router]);

  if (!isClient) return null;
  if (!isAuthorized) return <div>Loading...</div>;

  return <>{children}</>;
}
