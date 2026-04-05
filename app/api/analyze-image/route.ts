import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/server/firebase-auth";

const prompt =
  'Analyze this food image. Respond ONLY with a valid JSON object: { "name": "food name here", "calories": estimated_number }. No other text.';
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_REQUEST_SIZE_BYTES = 6 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const sessionUser = sessionToken
      ? await verifySessionToken(sessionToken)
      : null;

    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > MAX_REQUEST_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "Image is too large" },
        { status: 413 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const formData = await request.formData();
    const imageFile = formData.get("image");

    if (!(imageFile instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Only image uploads are supported" },
        { status: 400 }
      );
    }

    if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "Image is too large" },
        { status: 413 }
      );
    }

    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageFile.type,
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    let parsedResult;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        parsedResult = JSON.parse(text);
      }
    } catch {
      console.error("Failed to parse Gemini response:", text);
      return NextResponse.json(
        { success: false, error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    if (
      !parsedResult.name ||
      typeof parsedResult.calories !== "number" ||
      isNaN(parsedResult.calories)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid response from AI" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      result: {
        name: parsedResult.name,
        calories: Math.round(parsedResult.calories),
      },
    });
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to analyze image",
      },
      { status: 500 }
    );
  }
}
