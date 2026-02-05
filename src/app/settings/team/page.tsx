"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Invitation {
    id: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
}

interface Member {
    userId: string;
    role: string;
    user: {
        email: string;
        name: string | null;
    };
}

export default function TeamSettingsPage() {
    const { data: session } = useSession();
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("MEMBER");
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const workspaceId = session?.user?.activeWorkspaceId;

    useEffect(() => {
        if (workspaceId) {
            fetchInvitations();
            fetchMembers();
        }
    }, [workspaceId]);

    const fetchInvitations = async () => {
        try {
            const res = await fetch(`/api/v1/workspaces/${workspaceId}/invitations`);
            const data = await res.json();
            if (res.ok) {
                setInvitations(data);
            }
        } catch (err) {
            console.error("Failed to fetch invitations:", err);
        }
    };

    const fetchMembers = async () => {
        try {
            const res = await fetch(`/api/v1/workspaces/${workspaceId}/members`);
            const data = await res.json();
            if (res.ok) {
                setMembers(data);
            }
        } catch (err) {
            console.error("Failed to fetch members:", err);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch(`/api/v1/workspaces/${workspaceId}/invitations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to send invitation");
            }

            setSuccess(`Invitation sent to ${email}`);
            setEmail("");
            fetchInvitations();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (targetUserId: string, newRole: string) => {
        setError(null);
        setSuccess(null);
        try {
            const res = await fetch(`/api/v1/workspaces/${workspaceId}/members`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: targetUserId, role: newRole }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to update role");
            }

            setSuccess("Role updated successfully");
            fetchMembers();
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (!workspaceId) return <div className="p-8">Loading workspace...</div>;

    return (
        <div className="mx-auto max-w-4xl p-8">
            <h1 className="mb-8 text-3xl font-bold">Team Settings</h1>

            {error && (
                <div className="mb-4 rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}
            {success && (
                <div className="mb-4 rounded-md bg-green-50 p-4">
                    <p className="text-sm text-green-700">{success}</p>
                </div>
            )}

            <div className="mb-12 rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Invite Team Member</h2>
                <form onSubmit={handleInvite} className="flex space-x-4">
                    <input
                        type="email"
                        placeholder="colleague@example.com"
                        required
                        className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <select
                        className="rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="MEMBER">Member</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send Invite"}
                    </button>
                </form>
            </div>

            <div className="mb-12 rounded-lg border bg-white shadow-sm overflow-hidden">
                <h2 className="border-b px-6 py-4 text-xl font-semibold">Members</h2>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3">Member</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {members.map((member) => (
                            <tr key={member.userId}>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{member.user.name || "Unnamed User"}</div>
                                    <div className="text-sm text-gray-500">{member.user.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${member.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {member.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {member.role === "MEMBER" ? (
                                        <button
                                            onClick={() => handleUpdateRole(member.userId, "ADMIN")}
                                            className="text-indigo-600 hover:text-indigo-900 font-medium mr-4"
                                        >
                                            Promote
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleUpdateRole(member.userId, "MEMBER")}
                                            className="text-indigo-600 hover:text-indigo-900 font-medium mr-4"
                                        >
                                            Demote
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <h2 className="border-b px-6 py-4 text-xl font-semibold">Pending Invitations</h2>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Sent</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {invitations.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500 italic">
                                    No pending invitations
                                </td>
                            </tr>
                        ) : (
                            invitations.map((inv) => (
                                <tr key={inv.id}>
                                    <td className="px-6 py-4">{inv.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${inv.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {inv.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(inv.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-red-600 hover:text-red-900 font-medium">Revoke</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
