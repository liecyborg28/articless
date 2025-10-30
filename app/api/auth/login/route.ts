/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { login } from "@/app/api/auth/services";
import { loginSchema } from "@/app/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { error } = loginSchema.validate(body);

    if (error) {
      return NextResponse.json(
        { code: 400, message: error.message },
        { status: 400 }
      );
    }

    const user = await login(body);

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
