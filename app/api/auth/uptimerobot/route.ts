/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { login } from "@/app/api/auth/services";

export async function GET() {
  try {
    const user = await login({
      email: "uptimerobot@gmail.com",
      password: "12345678",
    });

    return NextResponse.json({
      code: 200,
      status: "success",
      message: "Login successful.",
      data: user,
    });
  } catch (err: any) {
    return NextResponse.json(
      { code: err.code || 500, message: err.message || "Something went wrong" },
      { status: err.code || 500 }
    );
  }
}
