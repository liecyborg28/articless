"use client";

import dynamic from "next/dynamic";

// Import DashboardClient secara dinamis
const DashboardClient = dynamic(() => import("./DashboardClient"), {
  ssr: false, // 🔥 Nonaktifkan SSR untuk file client
});

export default function DashboardPage() {
  return <DashboardClient />;
}
