"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";

interface Pincode {
    id: number;
    code: string;
    area?: string;
    is_active: boolean;
}

export default function AdminPincodesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [pincodes, setPincodes] = useState<Pincode[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Pincode | null>(null);
    const [form, setForm] = useState({ code: "", area: "", is_active: true });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") { router.push("/admin/login"); return; }
        if (status === "authenticated") fetchPincodes();
    }, [status, router]);

    const fetchPincodes = async () => {
        const res = await fetch("/api/admin/pincodes");
        setPincodes(await res.json());
    };

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const openAdd = () => {
        setEditing(null);
        setForm({ code: "", area: "", is_active: true });
        setShowModal(true);
    };

    const openEdit = (p: Pincode) => {
        setEditing(p);
        setForm({ code: p.code, area: p.area || "", is_active: p.is_active });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (editing) {
                res = await fetch(`/api/admin/pincodes/${editing.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
            } else {
                res = await fetch("/api/admin/pincodes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });
            }
            if (res.ok) {
                showToast("success", `Pincode ${editing ? "updated" : "added"}!`);
                setShowModal(false);
                fetchPincodes();
            } else {
                showToast("error", "Failed to save pincode.");
            }
        } catch {
            showToast("error", "Network error.");
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this pincode?")) return;
        const res = await fetch(`/api/admin/pincodes/${id}`, { method: "DELETE" });
        if (res.ok) {
            showToast("success", "Pincode deleted.");
            fetchPincodes();
        }
    };

    const toggleActive = async (p: Pincode) => {
        await fetch(`/api/admin/pincodes/${p.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...p, is_active: !p.is_active }),
        });
        fetchPincodes();
    };

    const filtered = pincodes.filter(
        (p) => p.code.includes(search) || (p.area || "").toLowerCase().includes(search.toLowerCase())
    );

    if (status === "loading" || !session) return null;

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-content">
                <div className="admin-topbar">
                    <h1 className="admin-topbar-title">📍 Pincodes</h1>
                    <button className="btn btn-primary" onClick={openAdd}>+ Add Pincode</button>
                </div>
                <main className="admin-main">
                    <div className="data-card">
                        <div className="data-card-header">
                            <h2 className="data-card-title">Service Pincodes ({pincodes.filter(p => p.is_active).length} active)</h2>
                            <input
                                type="text"
                                className="form-input"
                                style={{ width: 240, padding: "8px 12px", fontSize: 13 }}
                                placeholder="Search pincode or area..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {filtered.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📍</div>
                                <p className="empty-state-text">No pincodes yet</p>
                                <p className="empty-state-sub">Add pincodes to enable delivery checking on the website</p>
                            </div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Pincode</th>
                                        <th>Area / Location</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((p) => (
                                        <tr key={p.id}>
                                            <td><strong style={{ fontSize: 16, fontFamily: "monospace" }}>{p.code}</strong></td>
                                            <td>{p.area || "—"}</td>
                                            <td>
                                                <button
                                                    className={`badge ${p.is_active ? "badge-active" : "badge-inactive"}`}
                                                    style={{ cursor: "pointer", border: "none", background: "none" }}
                                                    onClick={() => toggleActive(p)}
                                                    title="Click to toggle"
                                                >
                                                    {p.is_active ? "✅ Active" : "❌ Inactive"}
                                                </button>
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(p)}>
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm"
                                                        style={{ background: "#fee2e2", color: "#dc2626", border: "none" }}
                                                        onClick={() => handleDelete(p.id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </main>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div className="modal">
                        <div className="modal-header">
                            <h2 className="modal-title">{editing ? "Edit Pincode" : "Add Pincode"}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Pincode *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        maxLength={6}
                                        placeholder="6-digit pincode"
                                        value={form.code}
                                        onChange={(e) => setForm({ ...form, code: e.target.value.replace(/\D/g, "") })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Area / Location</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. Ludhiana, Punjab"
                                        value={form.area}
                                        onChange={(e) => setForm({ ...form, area: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={form.is_active}
                                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    />
                                    <span className="form-label" style={{ margin: 0 }}>Active (deliverable)</span>
                                </label>
                            </div>
                            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Saving..." : editing ? "Save Changes" : "Add Pincode"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.type === "success" ? "✅" : "❌"} {toast.msg}
                </div>
            )}
        </div>
    );
}
