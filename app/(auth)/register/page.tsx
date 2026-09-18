"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to register");
            }

            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fff0f3] px-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl border border-rose-200 bg-white p-8 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-rose-950">Create Account</h2>
                    <p className="mt-1 text-sm text-rose-800/70">Sign up to get started with StudyMate</p>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-rose-950">Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full rounded-lg border border-rose-200 px-3 py-2 text-sm text-rose-950 focus:border-rose-700 focus:outline-none focus:ring-1 focus:ring-rose-700"
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-rose-950">Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="mt-1 block w-full rounded-lg border border-rose-200 px-3 py-2 text-sm text-rose-950 focus:border-rose-700 focus:outline-none focus:ring-1 focus:ring-rose-700"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-rose-950">Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="mt-1 block w-full rounded-lg border border-rose-200 px-3 py-2 text-sm text-rose-950 focus:border-rose-700 focus:outline-none focus:ring-1 focus:ring-rose-700"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-[#800f2f] py-2.5 text-sm font-medium text-white hover:bg-[#590d22] focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm text-rose-900/80">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-[#800f2f] hover:text-[#590d22]">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}