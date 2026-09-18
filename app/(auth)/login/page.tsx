"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (res?.error) {
                throw new Error("Invalid email or password");
            }

            router.push("/dashboard");
            router.refresh();
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
                    <h2 className="text-2xl font-bold text-rose-950">Welcome back</h2>
                    <p className="mt-1 text-sm text-rose-800/70">Sign in to your StudyMate account</p>
                </div>

                {registered && (
                    <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 border border-emerald-200">
                        Account created successfully! Please log in.
                    </div>
                )}

                {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
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
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-sm text-rose-900/80">
                    Don't have an account?{" "}
                    <Link href="/register" className="font-semibold text-[#800f2f] hover:text-[#590d22]">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}