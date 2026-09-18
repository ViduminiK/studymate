"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Send, PlusCircle } from "lucide-react";

interface Message {
    sender: "user" | "ai";
    text: string;
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string>("conv_1");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Load chat history from DB on page load or conversation change
    useEffect(() => {
        async function loadHistory() {
            try {
                const res = await fetch(`/api/chat?conversationId=${conversationId}`);
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (err) {
                console.error("Failed to load chat history:", err);
            }
        }
        loadHistory();
    }, [conversationId]);

    const handleNewChat = () => {
        const newId = `conv_${Date.now()}`;
        setConversationId(newId);
        setMessages([]);
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg, conversationId }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessages((prev) => [...prev, { sender: "ai", text: data.response }]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { sender: "ai", text: `Error: ${data.error}` },
                ]);
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: "Something went wrong. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col rounded-2xl border border-[#450920]/10 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#450920]/10 px-6 py-4">
                <div>
                    <h2 className="text-lg font-bold text-[#450920]">AI Study Assistant</h2>
                    <p className="text-xs text-[#da627d]">Ask questions, clarify concepts, or request examples.</p>
                </div>
                <button
                    onClick={handleNewChat}
                    className="flex items-center gap-2 rounded-xl bg-[#a4133c] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-[#450920]"
                >
                    <PlusCircle className="h-4 w-4" />
                    <span>New Chat</span>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        Ask anything to start studying!
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${
                            msg.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                msg.sender === "user"
                                    ? "bg-[#a4133c] text-white rounded-br-none"
                                    : "bg-[#450920]/5 text-[#450920] rounded-bl-none border border-[#450920]/10"
                            }`}
                        >
                            {msg.sender === "user" ? (
                                msg.text
                            ) : (
                                <div className="prose prose-sm max-w-none text-[#450920]">
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="rounded-2xl bg-[#450920]/5 px-4 py-3 text-sm text-[#da627d] rounded-bl-none animate-pulse">
                            StudyMate is thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="border-t border-[#450920]/10 p-4">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                    }}
                    className="flex gap-2"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything (e.g., Explain REST API in simple terms)..."
                        className="flex-1 rounded-xl border border-[#450920]/20 bg-white px-4 py-2.5 text-sm text-[#450920] placeholder-[#da627d]/50 focus:border-[#a4133c] focus:outline-none focus:ring-2 focus:ring-[#a4133c]/20"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center rounded-xl bg-[#a4133c] px-4 py-2.5 text-white transition-colors hover:bg-[#450920] disabled:opacity-50"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}