"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    FileText,
    HelpCircle,
    Layers,
    GraduationCap
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Chat", href: "/chat", icon: MessageSquare },
    { name: "Summarize Notes", href: "/summarize", icon: FileText },
    { name: "Quiz Generator", href: "/quiz", icon: HelpCircle },
    { name: "Flashcards", href: "/flashcards", icon: Layers },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r border-brand-primary/20 bg-brand-dark text-white">
            {/* Header / Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-brand-primary/30 px-6">
                <GraduationCap className="h-7 w-7 text-brand-soft" />
                <span className="text-xl font-bold tracking-wide text-brand-light">StudyMate</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1.5 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                                isActive
                                    ? "bg-brand-primary text-white shadow-sm"
                                    : "text-brand-light/70 hover:bg-brand-accent/20 hover:text-brand-light"
                            }`}
                        >
                            <Icon className={`h-5 w-5 ${isActive ? "text-brand-soft" : "text-brand-light/60"}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}