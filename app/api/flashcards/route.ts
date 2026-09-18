import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const prompt = `Create 5 study flashcards for "${topic}".
Return ONLY a valid JSON array of objects with "question" and "answer" properties.
Do NOT output markdown backticks or any conversation.
Example:
[
  {"question": "What is an API?", "answer": "Application Programming Interface."}
]`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
        });

        let rawText = response.text || "[]";

        // Clean up code block backticks if returned
        rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

        const flashcards = JSON.parse(rawText);

        return NextResponse.json({ flashcards });
    } catch (error) {
        console.error("Flashcards API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate flashcards" },
            { status: 500 }
        );
    }
}