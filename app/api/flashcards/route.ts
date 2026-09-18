import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { topic } = await req.json();

        if (!topic || topic.trim().length === 0) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

        const prompt = `Generate 4 study flashcards based on the following topic/text: "${topic}".
Respond ONLY with a raw JSON array matching this exact schema, without any markdown formatting or backticks:
[
  {
    "front": "Term, concept, or question",
    "back": "Clear, concise definition or answer"
  }
]`;

        // Retry loop for high-demand spikes
        let result;
        let retries = 3;
        let delay = 1000;

        while (retries > 0) {
            try {
                result = await model.generateContent(prompt);
                break;
            } catch (err: any) {
                if (err?.status === 503 && retries > 1) {
                    retries--;
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    delay *= 2;
                } else {
                    throw err;
                }
            }
        }

        if (!result) {
            throw new Error("Failed to retrieve content");
        }

        let text = result.response.text().trim();

        if (text.startsWith("```")) {
            text = text.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
        }

        const cards = JSON.parse(text);
        return NextResponse.json({ cards });
    } catch (error) {
        console.error("Flashcards Error:", error);
        return NextResponse.json(
            { error: "Failed to generate flashcards. Please try again." },
            { status: 500 }
        );
    }
}