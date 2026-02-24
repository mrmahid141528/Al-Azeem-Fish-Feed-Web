"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";

interface Dealer {
    id: number;
    name: string;
    phone: string;
    business?: string;
    city?: string;
    details: string;
    status: string;
    createdAt: string;
}

const statusOptions = ["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"];
const statusClass: Record<string, string> = {
    PENDING: "badge-pending",
    REVIEWING: "badge-reviewing",
    ACCEPTED: "badge-accepted",
    REJECTED: "badge-rejected",
};

export default function AdminDealersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [dealers, setDealers] = useState<Dealer[]>([]);
    const [selected, setSelected] = useState<Dealer | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") { router.push("/admin/login"); return; }
        if (status === "authenticated") fetchDealers();
    }, [status, router]);

    const fetchDealers = async () => {
        const res = await fetch("/api/admin/dealers");
        setDealers(await res.json());
    };

    const updateStatus = async (id: number, newStatus: string) => {
        const res = await fetch(`/api/admin/dealers/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
            showToast("success", "Status updated!");
            fetchDealers();
            if (selected?.id === id) setSelected({ ...selected, status: newStatus });
        }
    };

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    if (status === "loading" || !session) return null;

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-content">
                <div className="admin-topbar">
                    <h1 className="admin-topbar-title">🤝 Dealer Applications</h1>
                    <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                        {dealers.filter(d => d.status === "PENDING").length} pending
                    </span>
                </div>
                <main className="admin-main">
                    <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 20 }}>
                        <div className="data-card">
                            <div className="data-card-header">
                                <h2 className="data-card-title">Applications ({dealers.length})</h2>
                            </div>
                            {dealers.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">🤝</div>
                                    <p className="empty-state-text">No applications yet</p>
                                    <p className="empty-state-sub">Dealer applications will appear here</p>
                                </div>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Phone</th>
                                            <th>Business</th>
                                            <th>City</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dealers.map((d) => (
                                            <tr
                                                key={d.id}
                                                style={{ cursor: "pointer", background: selected?.id === d.id ? "#f0f9ff" : "" }}
                                                onClick={() => setSelected(d)}
                                            >
                                                <td><strong>{d.name}</strong></td>
                                                <td>
                                                    <a
                                                        href={`https://wa.me/91${d.phone.replace(/\D/g, "")}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ color: "#25D366", textDecoration: "none" }}
                                                    >
                                                        💬 {d.phone}
                                                    </a>
                                                </td>
                                                <td>{d.business || "—"}</td>
                                                <td>{d.city || "—"}</td>
                                                <td>
                                                    <span className={`badge ${statusClass[d.status]}`}>{d.status}</span>
                                                </td>
                                                <td>{new Date(d.createdAt).toLocaleDateString("en-IN")}</td>
                                                <td>
                                                    <select
                                                        className="form-select"
                                                        style={{ padding: "4px 8px", fontSize: 12, width: "130px" }}
                                                        value={d.status}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => updateStatus(d.id, e.target.value)}
                                                    >
                                                        {statusOptions.map((s) => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {selected && (
                            <div className="data-card" style={{ height: "fit-content" }}>
                                <div className="data-card-header">
                                    <h2 className="data-card-title">Application Details</h2>
                                    <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
                                </div>
                                <div style={{ padding: 20 }}>
                                    <span className={`badge ${statusClass[selected.status]}`}>{selected.status}</span>
                                    <div style={{ marginTop: 16 }}>
                                        {[
                                            { label: "Name", value: selected.name },
                                            { label: "Phone", value: selected.phone },
                                            { label: "Business", value: selected.business || "—" },
                                            { label: "City", value: selected.city || "—" },
                                            { label: "Details", value: selected.details },
                                            { label: "Applied On", value: new Date(selected.createdAt).toLocaleString("en-IN") },
                                        ].map((row) => (
                                            <div key={row.label} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                                                    {row.label}
                                                </div>
                                                <div style={{ fontSize: 14, color: "var(--text-primary)", marginTop: 4, lineHeight: 1.5 }}>{row.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                                        <a
                                            href={`https://wa.me/91${selected.phone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(selected.name)}!%20Thank%20you%20for%20applying%20to%20become%20an%20AL%20Azeem%20dealer.`}
                                            className="btn btn-whatsapp"
                                            style={{ flex: 1 }}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            💬 WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.type === "success" ? "✅" : "❌"} {toast.msg}
                </div>
            )}
        </div>
    );
}
