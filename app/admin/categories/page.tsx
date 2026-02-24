"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";

interface Category {
    id: number;
    name: string;
    image_url?: string | null;
    display_order: number;
    _count: { products: number };
}

const emptyForm = { name: "", image_url: "", display_order: "0" };

// ── Image Uploader ────────────────────────────────────────────────────────────
function ImageUploader({
    value,
    onChange,
}: {
    value: string;
    onChange: (url: string) => void;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [err, setErr] = useState("");

    const upload = useCallback(
        async (file: File) => {
            setErr("");
            if (!file.type.startsWith("image/")) { setErr("Only image files are allowed."); return; }
            if (file.size > 5 * 1024 * 1024) { setErr("Maximum file size is 5 MB."); return; }
            setUploading(true);
            const fd = new FormData();
            fd.append("file", file);
            try {
                const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                const data = await res.json();
                if (!res.ok) setErr(data.error || "Upload failed.");
                else onChange(data.url);
            } catch { setErr("Network error — please try again."); }
            setUploading(false);
        },
        [onChange]
    );

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) upload(file);
    };

    return (
        <div>
            {/* Preview */}
            {value && (
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: 160,
                        borderRadius: 12,
                        overflow: "hidden",
                        marginBottom: 12,
                        border: "2px solid var(--border)",
                        background: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={value}
                        alt="Category preview"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: "#dc2626",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: 28,
                            height: 28,
                            cursor: "pointer",
                            fontSize: 14,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                            lineHeight: 1,
                        }}
                        title="Remove image"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileRef.current?.click()}
                style={{
                    border: `2px dashed ${dragOver ? "var(--primary)" : "var(--border)"}`,
                    borderRadius: 12,
                    padding: "20px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragOver ? "var(--primary-light)" : "#fafafa",
                    transition: "all 0.2s",
                }}
            >
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
                />
                {uploading ? (
                    <>
                        <div style={{ fontSize: 28, marginBottom: 6 }}>⏳</div>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Uploading…</p>
                    </>
                ) : (
                    <>
                        <div style={{ fontSize: 30, marginBottom: 6 }}>🖼️</div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                            {value ? "Change Image" : "Upload Category Image"}
                        </p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                            Drag & drop or click · JPG, PNG, WebP · Max 5 MB
                        </p>
                    </>
                )}
            </div>

            {/* URL input option */}
            <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 5 }}>
                    Ya image URL direct paste karein:
                </p>
                <input
                    type="url"
                    className="form-input"
                    placeholder="https://example.com/category.jpg"
                    value={value.startsWith("/") ? "" : value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{ fontSize: 13 }}
                />
            </div>

            {err && (
                <p style={{ marginTop: 6, fontSize: 13, color: "#dc2626", fontWeight: 500 }}>❌ {err}</p>
            )}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminCategoriesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [categories, setCategories] = useState<Category[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") { router.push("/admin/login"); return; }
        if (status === "authenticated") fetchCategories();
    }, [status, router]);

    const fetchCategories = async () => {
        const res = await fetch("/api/admin/categories");
        if (res.ok) setCategories(await res.json());
    };

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    const openAdd = () => {
        setEditing(null);
        setForm({ ...emptyForm, display_order: String(categories.length) });
        setShowModal(true);
    };

    const openEdit = (cat: Category) => {
        setEditing(cat);
        setForm({
            name: cat.name,
            image_url: cat.image_url || "",
            display_order: String(cat.display_order),
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const body = {
                name: form.name.trim(),
                image_url: form.image_url || null,
                display_order: Number(form.display_order) || 0,
            };

            let res;
            if (editing) {
                res = await fetch(`/api/admin/categories/${editing.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
            } else {
                res = await fetch("/api/admin/categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
            }

            const data = await res.json();
            if (!res.ok) {
                showToast("error", data.error || "Failed to save.");
            } else {
                showToast("success", `Category ${editing ? "updated" : "added"} successfully!`);
                setShowModal(false);
                fetchCategories();
            }
        } catch {
            showToast("error", "Network error — please try again.");
        }
        setSaving(false);
    };

    const handleDelete = async (cat: Category) => {
        if (cat._count.products > 0) {
            showToast(
                "error",
                `"${cat.name}" mein ${cat._count.products} product(s) hain. Pehle unhe hatayein ya doosri category mein move karein.`
            );
            return;
        }
        if (!confirm(`"${cat.name}" category delete karein?`)) return;
        const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok) showToast("error", data.error || "Delete failed.");
        else { showToast("success", "Category deleted."); fetchCategories(); }
    };

    if (status === "loading" || !session) return null;

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-content">
                {/* Top bar */}
                <div className="admin-topbar">
                    <h1 className="admin-topbar-title">🗂️ Categories</h1>
                    <button className="btn btn-primary" onClick={openAdd}>
                        + Add Category
                    </button>
                </div>

                <main className="admin-main">
                    {/* ── Category Cards Grid ── */}
                    {categories.length === 0 ? (
                        <div className="data-card">
                            <div className="empty-state">
                                <div className="empty-state-icon">🗂️</div>
                                <p className="empty-state-text">Koi category nahi mili</p>
                                <p className="empty-state-sub">
                                    &quot;Add Category&quot; button se pehli category banayein
                                </p>
                                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openAdd}>
                                    + Add Category
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                gap: 20,
                                marginBottom: 32,
                            }}
                        >
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    style={{
                                        background: "white",
                                        borderRadius: 16,
                                        overflow: "hidden",
                                        border: "1px solid var(--border)",
                                        boxShadow: "var(--shadow-sm)",
                                        transition: "all 0.25s",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                                        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.transform = "";
                                        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
                                    }}
                                >
                                    {/* Image area */}
                                    <div
                                        style={{
                                            height: 140,
                                            background: cat.image_url
                                                ? `url(${cat.image_url}) center/cover`
                                                : "linear-gradient(135deg, var(--primary-light), #bae6fd)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 52,
                                            position: "relative",
                                        }}
                                    >
                                        {!cat.image_url && "🗂️"}

                                        {/* Order badge */}
                                        <span
                                            style={{
                                                position: "absolute",
                                                top: 10,
                                                left: 10,
                                                background: "rgba(0,0,0,0.55)",
                                                color: "white",
                                                fontSize: 11,
                                                fontWeight: 700,
                                                padding: "3px 9px",
                                                borderRadius: 50,
                                                backdropFilter: "blur(4px)",
                                            }}
                                        >
                                            #{cat.display_order}
                                        </span>
                                    </div>

                                    {/* Body */}
                                    <div style={{ padding: "16px 18px" }}>
                                        <h3
                                            style={{
                                                fontSize: 17,
                                                fontWeight: 700,
                                                color: "var(--text-primary)",
                                                marginBottom: 6,
                                            }}
                                        >
                                            {cat.name}
                                        </h3>
                                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 14 }}>
                                            🐟 {cat._count.products} product
                                            {cat._count.products !== 1 ? "s" : ""}
                                        </p>

                                        <div style={{ display: "flex", gap: 8 }}>
                                            <button
                                                className="btn btn-sm btn-outline"
                                                style={{ flex: 1 }}
                                                onClick={() => openEdit(cat)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="btn btn-sm"
                                                style={{
                                                    background:
                                                        cat._count.products > 0 ? "#f1f5f9" : "#fee2e2",
                                                    color:
                                                        cat._count.products > 0 ? "#94a3b8" : "#dc2626",
                                                    border: "none",
                                                    cursor:
                                                        cat._count.products > 0 ? "not-allowed" : "pointer",
                                                }}
                                                onClick={() => handleDelete(cat)}
                                                title={
                                                    cat._count.products > 0
                                                        ? "Pehle is category ke products hatayein"
                                                        : "Category delete karein"
                                                }
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Summary table ── */}
                    {categories.length > 0 && (
                        <div className="data-card">
                            <div className="data-card-header">
                                <h2 className="data-card-title">
                                    All Categories ({categories.length})
                                </h2>
                            </div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Display Order</th>
                                        <th>Products</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat) => (
                                        <tr key={cat.id}>
                                            <td>
                                                <div
                                                    style={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: 10,
                                                        overflow: "hidden",
                                                        background: "var(--primary-light)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: 22,
                                                        border: "1px solid var(--border)",
                                                    }}
                                                >
                                                    {cat.image_url ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={cat.image_url}
                                                            alt={cat.name}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    ) : (
                                                        "🗂️"
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <strong>{cat.name}</strong>
                                            </td>
                                            <td>{cat.display_order}</td>
                                            <td>
                                                <span
                                                    className={`badge ${cat._count.products > 0
                                                            ? "badge-active"
                                                            : "badge-inactive"
                                                        }`}
                                                >
                                                    {cat._count.products} products
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    <button
                                                        className="btn btn-sm btn-outline"
                                                        onClick={() => openEdit(cat)}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm"
                                                        style={{
                                                            background:
                                                                cat._count.products > 0 ? "#f1f5f9" : "#fee2e2",
                                                            color:
                                                                cat._count.products > 0
                                                                    ? "#94a3b8"
                                                                    : "#dc2626",
                                                            border: "none",
                                                            cursor:
                                                                cat._count.products > 0
                                                                    ? "not-allowed"
                                                                    : "pointer",
                                                        }}
                                                        onClick={() => handleDelete(cat)}
                                                        disabled={cat._count.products > 0}
                                                        title={
                                                            cat._count.products > 0
                                                                ? "Pehle products hatayein"
                                                                : "Delete"
                                                        }
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>

            {/* ── Add / Edit Modal ── */}
            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowModal(false);
                    }}
                >
                    <div className="modal" style={{ maxWidth: 540 }}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editing ? "✏️ Category Edit Karein" : "➕ Nayi Category"}
                            </h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Image uploader */}
                            <div className="form-group">
                                <label className="form-label">Category Image</label>
                                <ImageUploader
                                    value={form.image_url}
                                    onChange={(url) => setForm({ ...form, image_url: url })}
                                />
                            </div>

                            <hr
                                style={{
                                    border: "none",
                                    borderTop: "1px solid var(--border)",
                                    margin: "16px 0",
                                }}
                            />

                            {/* Name */}
                            <div className="form-group">
                                <label className="form-label">Category Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., Floating Fish Feed"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>

                            {/* Display Order */}
                            <div className="form-group">
                                <label className="form-label">Display Order</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="0"
                                    min="0"
                                    value={form.display_order}
                                    onChange={(e) =>
                                        setForm({ ...form, display_order: e.target.value })
                                    }
                                />
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: "var(--text-muted)",
                                        marginTop: 5,
                                    }}
                                >
                                    Chhota number pehle dikhega (0 = sabse pehle)
                                </p>
                            </div>

                            {/* Actions */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: 12,
                                    justifyContent: "flex-end",
                                    marginTop: 8,
                                }}
                            >
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving…"
                                        : editing
                                            ? "💾 Save Changes"
                                            : "➕ Add Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.type === "success" ? "✅" : "❌"} {toast.msg}
                </div>
            )}
        </div>
    );
}
