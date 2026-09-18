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

        const prompt = `Generate a 3-question multiple-choice quiz based on the following topic/text: "${topic}".
Respond ONLY with a raw JSON array matching this exact schema, without any markdown formatting or backticks:
[
  {
    "question": "Question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Brief explanation of why this answer is correct."
  }
]
Note: "answer" is the 0-based index of the correct option in the options array.`;

        // Retry wrapper for 503 Service Unavailable spikes
        let result;
        let retries = 3;
        let delay = 1000; // 1 second base delay

        while (retries > 0) {
            try {
                result = await model.generateContent(prompt);
                break; // Success! Break out of the retry loop.
            } catch (err: any) {
                if (err?.status === 503 && retries > 1) {
                    retries--;
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    delay *= 2; // Exponential backoff
                } else {
                    throw err;
                }
            }
        }

        if (!result) {
            throw new Error("Failed to retrieve content after retries");
        }

        let text = result.response.text().trim();

        // Clean markdown backticks if returned
        if (text.startsWith("```")) {
            text = text.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
        }

        const quiz = JSON.parse(text);
        return NextResponse.json({ quiz });
    } catch (error) {
        console.error("Quiz Error:", error);
        return NextResponse.json(
            { error: "Failed to generate quiz. Please try again." },
            { status: 500 }
        );
    }
}