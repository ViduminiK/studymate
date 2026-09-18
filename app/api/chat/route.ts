import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateWithRetry(message: string, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3.6-flash",
                contents: message,
                config: {
                    systemInstruction:
                        "You are StudyMate, a helpful and friendly AI study assistant. Answer questions clearly, accurately, and thoroughly in markdown format.",
                },
            });
            return response.text;
        } catch (error: any) {
            console.error(`Gemini API Error (Attempt ${i + 1}):`, error);
            const is503 = error?.status === 503 || error?.message?.includes("503");
            if (is503 && i < retries - 1) {
                await new Promise((resolve) => setTimeout(resolve, delay));
                delay *= 2;
            } else {
                throw error;
            }
        }
    }
}

export async function POST(req: Request) {
    try {
        const { message, conversationId = "conv_1" } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // 1. Ensure fallback test user exists in database
        const defaultUser = await prisma.user.upsert({
            where: { email: "test@studymate.com" },
            update: {},
            create: {
                email: "test@studymate.com",
                name: "Test Student",
                password: "password123",
            },
        });

        // 2. Ensure conversation exists and connect to test user
        const conversation = await prisma.conversation.upsert({
            where: { id: conversationId },
            update: {},
            create: {
                id: conversationId,
                title: "New Study Chat",
                user: {
                    connect: { id: defaultUser.id }
                }
            },
        });

        // 3. Save user message to database
        await prisma.message.create({
            data: {
                text: message,
                sender: "user",
                conversationId: conversation.id,
            },
        });

        // 4. Call Gemini API
        const aiResponseText = (await generateWithRetry(message)) || "Sorry, I couldn't generate a response.";

        // 5. Save AI response to database
        const savedAiMessage = await prisma.message.create({
            data: {
                text: aiResponseText,
                sender: "ai",
                conversationId: conversation.id,
            },
        });

        return NextResponse.json({ response: savedAiMessage.text });
    } catch (error: any) {
        console.error("FULL CHAT API ERROR:", error?.message || error);
        return NextResponse.json(
            { error: error?.message || "An unexpected error occurred." },
            { status: 500 }
        );
    }
}