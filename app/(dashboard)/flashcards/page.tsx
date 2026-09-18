"use client";

import { useState } from "react";
import { Layers, Sparkles, Loader2, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";

interface Flashcard {
    front: string;
    back: string;
}

export default function FlashcardsPage() {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim() || loading) return;

        setLoading(true);
        setCards([]);
        setCurrentIndex(0);
        setIsFlipped(false);

        try {
            const res = await fetch("/api/flashcards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
            });

            const data = await res.json();
            if (res.ok) {
                setCards(data.cards);
            } else {
                alert(data.error || "Failed to generate flashcards");
            }
        } catch (err) {
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setCurrentIndex((prev) => prev - 1);
        }
    };

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#450920]">Flashcards Generator</h1>
                <p className="text-sm text-[#da627d]">
                    Generate interactive flashcards to review terms and definitions quickly.
                </p>
            </div>

            {/* Topic Input */}
            <div className="rounded-2xl border border-[#450920]/10 bg-white p-5 shadow-sm space-y-4">
                <label className="text-xs font-semibold text-[#450920]">STUDY TOPIC</label>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Database Indexing & B-Trees"
                        className="flex-1 rounded-xl border border-[#450920]/20 bg-white px-4 py-2.5 text-sm text-[#450920] placeholder-[#da627d]/50 focus:border-[#a4133c] focus:outline-none focus:ring-2 focus:ring-[#a4133c]/20"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !topic.trim()}
                        className="flex items-center gap-2 rounded-xl bg-[#a4133c] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#450920] disabled:opacity-50 shrink-0"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                <span>Generate</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Flashcard Carousel */}
            {cards.length > 0 && (
                <div className="space-y-6">
                    {/* Main Card */}
                    <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="group relative h-72 w-full cursor-pointer rounded-2xl border border-[#450920]/10 bg-white p-8 shadow-md transition-all hover:shadow-lg flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between text-xs font-semibold text-[#da627d]">
              <span>
                CARD {currentIndex + 1} OF {cards.length}
              </span>
                            <span className="flex items-center gap-1 opacity-70 group-hover:opacity-100">
                <RotateCw className="h-3.5 w-3.5" />
                Click to flip
              </span>
                        </div>

                        <div className="flex flex-1 items-center justify-center p-4 text-center">
                            <p className="text-lg font-medium leading-relaxed text-[#450920]">
                                {isFlipped ? cards[currentIndex].back : cards[currentIndex].front}
                            </p>
                        </div>

                        <div className="text-center text-xs font-semibold uppercase tracking-wider text-[#a4133c]/60">
                            {isFlipped ? "Answer / Explanation" : "Question / Term"}
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="flex items-center gap-1 rounded-xl border border-[#450920]/20 bg-white px-4 py-2 text-sm font-semibold text-[#450920] transition-all hover:bg-[#450920]/5 disabled:opacity-30"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Previous</span>
                        </button>

                        <span className="text-xs font-semibold text-[#da627d]">
              {currentIndex + 1} / {cards.length}
            </span>

                        <button
                            onClick={handleNext}
                            disabled={currentIndex === cards.length - 1}
                            className="flex items-center gap-1 rounded-xl border border-[#450920]/20 bg-white px-4 py-2 text-sm font-semibold text-[#450920] transition-all hover:bg-[#450920]/5 disabled:opacity-30"
                        >
                            <span>Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}