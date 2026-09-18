"use client";

import { useState } from "react";
import { HelpCircle, Sparkles, Loader2, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

interface Question {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
}

export default function QuizPage() {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [quiz, setQuiz] = useState<Question[] | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
    const [submitted, setSubmitted] = useState(false);

    const handleGenerateQuiz = async () => {
        if (!topic.trim() || loading) return;

        setLoading(true);
        setQuiz(null);
        setSelectedAnswers({});
        setSubmitted(false);

        try {
            const res = await fetch("/api/quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
            });

            const data = await res.json();
            if (res.ok) {
                setQuiz(data.quiz);
            } else {
                alert(data.error || "Failed to generate quiz");
            }
        } catch (err) {
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOption = (qIdx: number, optIdx: number) => {
        if (submitted) return;
        setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    };

    const calculateScore = () => {
        if (!quiz) return 0;
        return quiz.reduce((score, q, idx) => {
            return selectedAnswers[idx] === q.answer ? score + 1 : score;
        }, 0);
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#450920]">Quiz Generator</h1>
                <p className="text-sm text-[#da627d]">
                    Enter a topic or paste study material to generate interactive test questions.
                </p>
            </div>

            {/* Input Section */}
            <div className="rounded-2xl border border-[#450920]/10 bg-white p-5 shadow-sm space-y-4">
                <label className="text-xs font-semibold text-[#450920]">QUIZ TOPIC / MATERIAL</label>
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic (e.g., Software Architecture Patterns) or paste lecture text..."
                    className="h-28 w-full resize-none rounded-xl border border-[#450920]/20 bg-white p-4 text-sm text-[#450920] placeholder-[#da627d]/50 focus:border-[#a4133c] focus:outline-none focus:ring-2 focus:ring-[#a4133c]/20"
                />
                <button
                    onClick={handleGenerateQuiz}
                    disabled={loading || !topic.trim()}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#a4133c] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#450920] disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Generating Quiz...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-4 w-4" />
                            <span>Generate Quiz</span>
                        </>
                    )}
                </button>
            </div>

            {/* Quiz Display Section */}
            {quiz && (
                <div className="space-y-6">
                    {quiz.map((q, qIdx) => (
                        <div key={qIdx} className="rounded-2xl border border-[#450920]/10 bg-white p-6 shadow-sm space-y-4">
                            <h3 className="text-base font-semibold text-[#450920]">
                                {qIdx + 1}. {q.question}
                            </h3>

                            <div className="space-y-2">
                                {q.options.map((opt, optIdx) => {
                                    const isSelected = selectedAnswers[qIdx] === optIdx;
                                    const isCorrect = q.answer === optIdx;

                                    let style = "border-[#450920]/15 hover:bg-[#450920]/5 text-[#450920]";

                                    if (submitted) {
                                        if (isCorrect) {
                                            style = "border-emerald-500 bg-emerald-50 text-emerald-900 font-medium";
                                        } else if (isSelected && !isCorrect) {
                                            style = "border-rose-500 bg-rose-50 text-rose-900";
                                        }
                                    } else if (isSelected) {
                                        style = "border-[#a4133c] bg-[#a4133c]/10 text-[#450920] font-medium";
                                    }

                                    return (
                                        <button
                                            key={optIdx}
                                            onClick={() => handleSelectOption(qIdx, optIdx)}
                                            className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm transition-all ${style}`}
                                        >
                                            <span>{opt}</span>
                                            {submitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                                            {submitted && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-rose-600" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {submitted && (
                                <div className="mt-3 rounded-xl bg-[#450920]/5 p-3.5 text-xs text-[#450920]">
                                    <span className="font-semibold">Explanation: </span>
                                    {q.explanation}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Action Footer */}
                    <div className="flex items-center justify-between rounded-2xl border border-[#450920]/10 bg-white p-5 shadow-sm">
                        {submitted ? (
                            <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-[#450920]">
                  Score: {calculateScore()} / {quiz.length}
                </span>
                                <button
                                    onClick={handleGenerateQuiz}
                                    className="flex items-center gap-2 rounded-xl bg-[#a4133c] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#450920]"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    <span>Try Another Quiz</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setSubmitted(true)}
                                disabled={Object.keys(selectedAnswers).length < quiz.length}
                                className="rounded-xl bg-[#a4133c] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#450920] disabled:opacity-50"
                            >
                                Submit Answers
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}