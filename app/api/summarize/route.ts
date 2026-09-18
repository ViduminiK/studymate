import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Summarize the following text into concise key points:\n\n${text}`,
        });

        const summary = response.text || "Failed to generate summary.";

        return NextResponse.json({ summary });
    } catch (error: any) {
        console.error("Summarize API Error:", error);

        // Handle Rate Limit (429) specifically
        if (error?.status === 429 || error?.toString().includes("429")) {
            return NextResponse.json(
                { error: "API rate limit reached. Please wait a minute and try again." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: "Failed to generate summary." },
            { status: 500 }
        );
    }
}