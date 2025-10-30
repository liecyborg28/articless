/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { register } from "@/app/api/auth/services";
import { registerSchema } from "@/app/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { error } = registerSchema.validate(body);

    if (error) {
      return NextResponse.json(
        { code: 400, message: error.message },
        { status: 400 }
      );
    }

    const user = await register(body);

    return NextResponse.json(
      {
        code: 200,
        status: "success",
        message:
          "Registration successful. Please confirm your email before logging in.",
        data: user,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { code: err.code || 500, message: err.message || "Something went wrong" },
      { status: err.code || 500 }
    );
  }
}
