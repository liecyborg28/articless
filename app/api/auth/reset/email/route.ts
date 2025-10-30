/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";
import { supabase } from "@/app/utils/supabase";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        {
          code: 404,
          message:
            "We couldn’t find an account with that email. Please double-check and try again.",
        },
        { status: 404 }
      );
    }

    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset/password?id=${user.id}`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      return NextResponse.json(
        { code: 400, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      code: 200,
      status: "success",
      message: "Password reset email sent. Check your inbox.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { code: err.code || 500, message: err.message },
      { status: err.code || 500 }
    );
  }
}
