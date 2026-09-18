"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { FileText, Sparkles, Loader2, Copy, Check } from "lucide-react";

export default function SummarizePage() {
    const [text, setText] = useState("");
    const [mode, setMode] = useState<"concise" | "detailed">("concise");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSummarize = async () => {
        if (!text.trim() || loading) return;

        setLoading(true);
        setSummary("");

        try {
            const res = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, mode }),
            });

            const data = await res.json();
            if (res.ok) {
                setSummary(data.summary);
            } else {
                setSummary(`Error: ${data.error}`);
            }
        } catch (err) {
            setSummary("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#450920]">Summarize Notes</h1>
                <p className="text-sm text-[#da627d]">
                    Paste raw lecture material or articles below to generate formatted study notes.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Input Column */}
                <div className="flex flex-col space-y-4 rounded-2xl border border-[#450920]/10 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-[#450920]">
                            SOURCE MATERIAL
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setMode("concise")}
                                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                                    mode === "concise"
                                        ? "bg-[#a4133c] text-white"
                                        : "bg-[#450920]/5 text-[#450920] hover:bg-[#450920]/10"
                                }`}
                            >
                                Concise
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode("detailed")}
                                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                                    mode === "detailed"
                                        ? "bg-[#a4133c] text-white"
                                        : "bg-[#450920]/5 text-[#450920] hover:bg-[#450920]/10"
                                }`}
                            >
                                Detailed
                            </button>
                        </div>
                    </div>

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your lecture notes, slides, or study topics here..."
                        className="h-[calc(100vh-18rem)] w-full resize-none rounded-xl border border-[#450920]/20 bg-white p-4 text-sm text-[#450920] placeholder-[#da627d]/50 focus:border-[#a4133c] focus:outline-none focus:ring-2 focus:ring-[#a4133c]/20"
                    />

                    <button
                        onClick={handleSummarize}
                        disabled={loading || !text.trim()}
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#a4133c] py-3 text-sm font-semibold text-white transition-all hover:bg-[#450920] disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Summarizing...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                <span>Generate Summary</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Output Column */}
                <div className="flex flex-col space-y-4 rounded-2xl border border-[#450920]/10 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#450920]/10 pb-3">
                        <label className="text-xs font-semibold text-[#450920]">
                            SUMMARY RESULT
                        </label>
                        {summary && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 rounded-lg bg-[#450920]/5 px-2.5 py-1 text-xs font-medium text-[#450920] hover:bg-[#450920]/10"
                            >
                                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                <span>{copied ? "Copied" : "Copy"}</span>
                            </button>
                        )}
                    </div>

                    <div className="h-[calc(100vh-14rem)] overflow-y-auto rounded-xl bg-[#450920]/5 p-5 text-sm text-[#450920]">
                        {summary ? (
                            <div className="prose prose-sm max-w-none text-[#450920]">
                                <ReactMarkdown>{summary}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400">
                                Your generated summary will appear here.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}