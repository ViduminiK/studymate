import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // 1. Fetch default user (or authenticated user)
        const user = await prisma.user.findUnique({
            where: { email: "test@studymate.com" },
        });

        if (!user) {
            return NextResponse.json({ savedChats: 0, quizzes: 0, flashcards: 0 });
        }

        // 2. Count total saved conversations for this user
        const savedChatsCount = await prisma.conversation.count({
            where: { userId: user.id },
        });

        return NextResponse.json({
            savedChats: savedChatsCount,
            quizzes: 0,
            flashcards: 0,
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json({ savedChats: 0, quizzes: 0, flashcards: 0 }, { status: 500 });
    }
}