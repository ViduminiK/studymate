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
            model: "gemini-3.6-flash",
            contents: `Summarize the following text into clear bullet points and key takeaways:\n\n${text}`,
        });

        const summary = response.text || "Failed to generate summary.";

        return NextResponse.json({ summary });
    } catch (error) {
        console.error("Summarize API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate summary" },
            { status: 500 }
        );
    }
}