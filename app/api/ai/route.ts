import { NextResponse } from "next/server";
import { model } from "@/app/utils/gemini";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const result = await model.generateContent(prompt);
    const text = result.response.text() || "";
    return NextResponse.json({ text });
  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json({ text: "" }, { status: 500 });
  }
}
