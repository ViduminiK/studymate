"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    MessageSquare,
    FileText,
    HelpCircle,
    Layers,
    ArrowRight,
    Sparkles,
    Zap,
    Lightbulb,
    Clock
} from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const [greeting, setGreeting] = useState("Welcome back!");

    const studyTips = [
        "Try the Pomodoro Technique: 25 minutes of focus followed by a 5-minute break.",
        "Active recall using quizzes boosts long-term retention far better than passive reading.",
        "Break complex topics into 3 key bullet points when summarizing lecture notes."
    ];

    const [currentTip, setCurrentTip] = useState(studyTips[0]);

    useEffect(() => {
        // Dynamic greeting based on time of day
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning!");
        else if (hour < 18) setGreeting("Good afternoon!");
        else setGreeting("Good evening!");

        // Set random study tip
        const randomTip = studyTips[Math.floor(Math.random() * studyTips.length)];
        setCurrentTip(randomTip);
    }, []);

    const quickTools = [
        {
            title: "AI Chat Assistant",
            description: "Ask questions, debug code, or clarify complex topics instantly.",
            icon: MessageSquare,
            path: "/chat",
            badge: "Interactive",
        },
        {
            title: "Summarize Notes",
            description: "Paste lecture notes or textbook passages to extract key concepts.",
            icon: FileText,
            path: "/summarize",
            badge: "AI Powered",
        },
        {
            title: "Quiz Generator",
            description: "Create custom multiple-choice quizzes to test your knowledge.",
            icon: HelpCircle,
            path: "/quiz",
            badge: "Practice",
        },
        {
            title: "Flashcard Creator",
            description: "Generate flippable study cards for terms and definitions.",
            icon: Layers,
            path: "/flashcards",
            badge: "Revision",
        },
    ];

    return (
        <div className="max-w-6xl space-y-8">
            {/* Header Banner */}
            <div className="rounded-2xl border border-[#450920]/10 bg-gradient-to-r from-[#450920] to-[#a4133c] p-6 text-white shadow-md">
                <div className="max-w-2xl space-y-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                        <Sparkles className="h-3.5 w-3.5 text-pink-300" />
                        <span>Study Workspace Active</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{greeting} 👋</h1>
                    <p className="text-sm text-pink-100">
                        Pick up where you left off or jump straight into one of your AI study tools below.
                    </p>
                </div>
            </div>

            {/* Dynamic Widgets Row */}
            <div className="grid gap-4 sm:grid-cols-3">
                {/* Widget 1: System Status */}
                <div className="flex items-start gap-3 rounded-2xl border border-[#450920]/10 bg-white p-5 shadow-sm">
                    <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                        <Zap className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-xs font-bold uppercase tracking-wider text-[#da627d]">AI Engine</p>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-[#450920]">Gemini 3.6 Flash</p>
                        <p className="text-[11px] text-slate-500">Connected & Ready</p>
                    </div>
                </div>

                {/* Widget 2: Dynamic Study Tip */}
                <div className="flex items-start gap-3 rounded-2xl border border-[#450920]/10 bg-white p-5 shadow-sm">
                    <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                        <Lightbulb className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#da627d]">Study Tip</p>
                        <p className="mt-1 text-xs font-medium text-[#450920] leading-relaxed">
                            {currentTip}
                        </p>
                    </div>
                </div>

                {/* Widget 3: Quick Action Banner */}
                <div
                    onClick={() => router.push("/chat")}
                    className="group cursor-pointer flex items-start gap-3 rounded-2xl border border-[#a4133c]/20 bg-[#fff5f7] p-5 shadow-sm transition-all hover:border-[#a4133c]"
                >
                    <div className="rounded-xl bg-[#a4133c] p-2.5 text-white transition-transform group-hover:scale-105">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#a4133c]">Quick Start</p>
                        <p className="mt-1 text-sm font-bold text-[#450920]">Start Chat Session</p>
                        <span className="mt-1 inline-flex items-center text-[11px] font-semibold text-[#a4133c]">
              Ask anything <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
            </span>
                    </div>
                </div>
            </div>

            {/* Quick Launch Cards */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-[#450920]">Study Tools</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    {quickTools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <div
                                key={tool.title}
                                onClick={() => router.push(tool.path)}
                                className="group cursor-pointer rounded-2xl border border-[#450920]/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="rounded-xl bg-[#fff5f7] p-2.5 text-[#a4133c] transition-colors group-hover:bg-[#a4133c] group-hover:text-white">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="rounded-full bg-[#fff5f7] px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase text-[#a4133c]">
                      {tool.badge}
                    </span>
                                    </div>
                                    <h3 className="text-base font-bold text-[#450920] group-hover:text-[#a4133c]">
                                        {tool.title}
                                    </h3>
                                    <p className="text-xs text-[#da627d] leading-relaxed">
                                        {tool.description}
                                    </p>
                                </div>

                                <div className="flex items-center text-xs font-semibold text-[#a4133c]">
                                    <span>Launch Tool</span>
                                    <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}