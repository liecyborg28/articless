/* eslint-disable @typescript-eslint/no-explicit-any */
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

export async function extractTextClient(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  const arrayBuffer = await file.arrayBuffer();

  if (ext === "pdf") {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(" ");
      text += pageText + "\n";
    }

    return text.trim();
  }

  if (ext === "docx") {
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value.trim();
  }

  throw new Error("Unsupported file type. Only .pdf and .docx are supported.");
}
