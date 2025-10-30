/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/app/utils/jwt"; // tetap pakai utils yang sama

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Tentukan route yang perlu auth
  if (
    pathname.startsWith("/api/profile") ||
    pathname.startsWith("/api/histories")
  ) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { code: 401, message: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      verifyToken(token); // validasi jwt
    } catch (err) {
      return NextResponse.json(
        { code: 401, message: "Invalid token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

// Jalankan middleware hanya di path tertentu
export const config = {
  matcher: ["/api/profile/:path*", "/api/histories/:path*"],
};
