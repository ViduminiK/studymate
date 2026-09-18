"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    FileText,
    HelpCircle,
    Layers,
    GraduationCap,
    LogOut
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
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
    };

    return (
        <div className="flex h-screen w-64 flex-col border-r border-[#450920]/20 bg-[#450920] text-white">
            {/* Logo Header */}
            <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#a4133c] text-white shadow-sm">
                    <GraduationCap className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-wide text-white">StudyMate</span>
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
                            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                                isActive
                                    ? "bg-[#a4133c] text-white shadow-md shadow-[#a4133c]/30"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            <Icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout Section */}
            <div className="border-t border-white/10 p-3">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}