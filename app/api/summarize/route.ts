import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { text, mode } = await req.json();

        if (!text || text.trim().length === 0) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

        const prompt = `You are an expert study assistant. Summarize the following lecture notes using clear, bulleted markdown format.
Mode requested: ${mode} (Options: concise = brief key points, detailed = deep breakdown with examples).

Notes:
${text}`;

        const result = await model.generateContent(prompt);
        const summary = result.response.text();

        return NextResponse.json({ summary });
    } catch (error) {
        console.error("Summarize Error:", error);
        return NextResponse.json(
            { error: "Failed to generate summary" },
            { status: 500 }
        );
    }
}