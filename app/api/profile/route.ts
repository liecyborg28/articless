/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { verifyToken } from "@/app/utils/jwt";
import { prisma } from "@/app/utils/prisma";
import { updateProfileSchema } from "@/app/validations/profile";
import dotenv from "dotenv";

dotenv.config();

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token: any = authHeader?.split(" ")[1];
    const decoded = verifyToken(token);

    const profile = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!profile) {
      return NextResponse.json(
        { code: 404, message: "User not found" },
        { status: 404 }
      );
    }

    const profileResponse = {
      ...profile,
      photo_profile: `${process.env.BE_URL}/uploads/${profile.photo_profile}`,
    };

    return NextResponse.json({
      code: 200,
      status: "success",
      message: "Get profile successfully!",
      data: profileResponse,
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { error } = updateProfileSchema.validate(body);
    if (error)
      return NextResponse.json(
        { code: 400, message: error.message },
        { status: 400 }
      );

    const authHeader = req.headers.get("authorization");
    const token: any = authHeader?.split(" ")[1];
    const decoded = verifyToken(token);

    const { full_name = null, photo_profile = null } = body;

    const updated = await prisma.user.update({
      where: { id: decoded.id },
      data: { full_name, photo_profile },
    });

    return NextResponse.json({
      code: 201,
      status: "success",
      message: "Update profile successfully!",
      data: {
        ...updated,
        photo_profile: `${process.env.BE_URL}/uploads/${photo_profile}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { code: 500, message: String(error) },
      { status: 500 }
    );
  }
}
