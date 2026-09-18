import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const prompt = `Create 5 flashcards for the topic "${topic}". 
Return ONLY a valid JSON array of objects with "question" and "answer" fields. Do not include markdown formatting or backticks.
Example format:
[
  {"question": "What is API?", "answer": "Application Programming Interface"}
]`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
        });

        let responseText = response.text || "[]";

        // Clean up code block backticks if returned
        responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        const flashcards = JSON.parse(responseText);

        return NextResponse.json({ flashcards });
    } catch (error) {
        console.error("Flashcards API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate flashcards" },
            { status: 500 }
        );
    }
}