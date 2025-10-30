/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { resetPassword } from "@/app/services/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const updatedUser = await resetPassword(body);

    return NextResponse.json({
      code: 200,
      status: "success",
      message: "Reset password successful.",
      data: updatedUser,
    });
  } catch (err: any) {
    return NextResponse.json(
      { code: err.code || 500, message: err.message },
      { status: err.code || 500 }
    );
  }
}
