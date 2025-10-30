/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { verifyToken } from "@/app/utils/jwt";
import { prisma } from "@/app/utils/prisma";

export async function GET(req: Request) {
  try {
    const token: any = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user)
      return NextResponse.json(
        { code: 404, message: "User not found" },
        { status: 404 }
      );

    const histories = await prisma.history.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({
      code: 200,
      status: "success",
      message: "Get histories successfully!",
      data: histories,
    });
  } catch (err) {
    return NextResponse.json(
      { code: 500, message: String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const token: any = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);

    const body = await req.json();
    const { text = null } = body;

    const new_history = await prisma.history.create({
      data: { user_id: decoded.id, text },
    });

    const histories = await prisma.history.findMany({
      where: { user_id: decoded.id },
    });

    return NextResponse.json({
      code: 200,
      status: "success",
      message: "Create history successfully!",
      data: { new_history, histories },
    });
  } catch (err) {
    return NextResponse.json(
      { code: 500, message: String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const token: any = req.headers.get("authorization")?.split(" ")[1];
    const decoded = verifyToken(token);

    const body = await req.json();
    const { id } = body;

    const deleted = await prisma.history.delete({ where: { id } });
    const histories = await prisma.history.findMany({
      where: { user_id: decoded.id },
    });

    return NextResponse.json({
      code: 200,
      status: "success",
      message: "Delete history successfully!",
      data: { deleted, histories },
    });
  } catch (err) {
    return NextResponse.json(
      { code: 500, message: String(err) },
      { status: 500 }
    );
  }
}
