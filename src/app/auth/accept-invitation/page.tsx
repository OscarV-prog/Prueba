"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AcceptInvitationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const { data: session, status } = useSession();

    const [invitation, setInvitation] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("No invitation token provided.");
            setLoading(false);
            return;
        }

        fetchInvitation();
    }, [token]);

    const fetchInvitation = async () => {
        try {
            const res = await fetch(`/api/v1/auth/accept-invitation?token=${token}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to load invitation.");
            }

            setInvitation(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        if (status === "unauthenticated") {
            // Redirect to signup with token preserved
            router.push(`/auth/signup?token=${token}`);
            return;
        }

        setProcessing(true);
        try {
            const res = await fetch("/api/v1/auth/accept-invitation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            // Success! Refresh session and redirect
            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-xl font-medium">Verifying invitation...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                {error ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600">Error</h2>
                        <p className="mt-4 text-gray-600">{error}</p>
                        <Link
                            href="/"
                            className="mt-6 inline-block text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                            Go back home
                        </Link>
                    </div>
                ) : (
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            You've been invited!
                        </h2>
                        <p className="mt-4 text-gray-600">
                            You have been invited to join <span className="font-bold text-gray-900">{invitation.workspace.name}</span> as a <span className="font-medium text-indigo-600">{invitation.role}</span>.
                        </p>

                        <div className="mt-8 space-y-4">
                            <button
                                onClick={handleAccept}
                                disabled={processing}
                                className="w-full rounded-md bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                            >
                                {processing ? "Joining..." : status === "authenticated" ? "Accept & Join" : "Create Account to Join"}
                            </button>

                            {status === "authenticated" && session?.user?.email !== invitation.email && (
                                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                                    Note: You are currently logged in as <span className="font-semibold">{session.user.email}</span>.
                                    This invitation was sent to <span className="font-semibold">{invitation.email}</span>.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
