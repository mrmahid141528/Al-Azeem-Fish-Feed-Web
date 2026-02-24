"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";

interface Product {
    id: number;
    name: string;
    description?: string;
    category: { id: number; name: string };
    category_id: number;
    protein_percent?: string;
    size?: string;
    price?: number;
    image_url?: string;
    is_active: boolean;
}

interface Category {
    id: number;
    name: string;
}

const emptyForm = {
    name: "",
    description: "",
    category_id: "",
    protein_percent: "",
    size: "",
    price: "",
    image_url: "",
    is_active: true,
};

// ─── Image Uploader Component ────────────────────────────────────────────────
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
    const [error, setError] = useState("");

    const upload = useCallback(
        async (file: File) => {
            setError("");
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            try {
                const res = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || "Upload failed");
                } else {
                    onChange(data.url);
                }
            } catch {
                setError("Network error during upload.");
            }
            setUploading(false);
        },
        [onChange]
    );

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }
        upload(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div>
            {/* Preview */}
            {value && (
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: 180,
                        borderRadius: 12,
                        overflow: "hidden",
                        marginBottom: 12,
                        border: "2px solid var(--border)",
                        background: "#f8fafc",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={value}
                        alt="Product preview"
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
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
                            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
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
                    padding: "24px 16px",
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
                    onChange={handleChange}
                />
                {uploading ? (
                    <div>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
                        <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 600 }}>
                            Uploading...
                        </p>
                    </div>
                ) : (
                    <div>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                            {value ? "Change Image" : "Upload Product Image"}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                            Drag & drop or click to select · JPG, PNG, WebP · Max 5MB
                        </p>
                    </div>
                )}
            </div>

            {/* URL input option */}
            <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
                    Or paste an image URL directly:
                </p>
                <input
                    type="url"
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                    value={value.startsWith("/") ? "" : value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{ fontSize: 13 }}
                />
            </div>

            {error && (
                <p style={{ marginTop: 8, fontSize: 13, color: "#dc2626", fontWeight: 500 }}>
                    ❌ {error}
                </p>
            )}
        </div>
    );
}

// ─── Main Products Page ───────────────────────────────────────────────────────
export default function AdminProductsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin/login");
            return;
        }
        if (status === "authenticated") {
            fetchData();
        }
    }, [status, router]);

    const fetchData = async () => {
        const [pRes, cRes] = await Promise.all([
            fetch("/api/admin/products"),
            fetch("/api/categories"),
        ]);
        setProducts(await pRes.json());
        setCategories(await cRes.json());
    };

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    const openAdd = () => {
        setEditing(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (p: Product) => {
        setEditing(p);
        setForm({
            name: p.name,
            description: p.description || "",
            category_id: String(p.category_id),
            protein_percent: p.protein_percent || "",
            size: p.size || "",
            price: p.price ? String(p.price) : "",
            image_url: p.image_url || "",
            is_active: p.is_active,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const body = {
                ...form,
                category_id: Number(form.category_id),
                price: form.price ? Number(form.price) : null,
            };
            let res;
            if (editing) {
                res = await fetch(`/api/admin/products/${editing.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
            } else {
                res = await fetch("/api/admin/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
            }
            if (res.ok) {
                showToast("success", `Product ${editing ? "updated" : "added"} successfully!`);
                setShowModal(false);
                fetchData();
            } else {
                showToast("error", "Failed to save product.");
            }
        } catch {
            showToast("error", "Network error.");
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (res.ok) {
            showToast("success", "Product deleted.");
            fetchData();
        }
    };

    if (status === "loading" || !session) return null;

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-content">
                <div className="admin-topbar">
                    <h1 className="admin-topbar-title">🐟 Products</h1>
                    <button className="btn btn-primary" onClick={openAdd}>
                        + Add Product
                    </button>
                </div>

                <main className="admin-main">
                    <div className="data-card">
                        <div className="data-card-header">
                            <h2 className="data-card-title">
                                All Products ({products.length})
                            </h2>
                        </div>

                        {products.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">🐟</div>
                                <p className="empty-state-text">No products yet</p>
                                <p className="empty-state-sub">
                                    Click &quot;Add Product&quot; to get started
                                </p>
                            </div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Protein</th>
                                        <th>Size</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => (
                                        <tr key={p.id}>
                                            {/* Thumbnail */}
                                            <td>
                                                <div
                                                    style={{
                                                        width: 52,
                                                        height: 52,
                                                        borderRadius: 10,
                                                        overflow: "hidden",
                                                        background: "var(--primary-light)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: 24,
                                                        border: "1px solid var(--border)",
                                                    }}
                                                >
                                                    {p.image_url ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={p.image_url}
                                                            alt={p.name}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    ) : (
                                                        "🐟"
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <strong>{p.name}</strong>
                                            </td>
                                            <td>{p.category?.name}</td>
                                            <td>{p.protein_percent || "—"}</td>
                                            <td>{p.size || "—"}</td>
                                            <td>{p.price ? `₹${p.price}` : "—"}</td>
                                            <td>
                                                <span
                                                    className={`badge ${p.is_active ? "badge-active" : "badge-inactive"
                                                        }`}
                                                >
                                                    {p.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    <button
                                                        className="btn btn-sm btn-outline"
                                                        onClick={() => openEdit(p)}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm"
                                                        style={{
                                                            background: "#fee2e2",
                                                            color: "#dc2626",
                                                            border: "none",
                                                        }}
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

            {/* ── Add / Edit Modal ── */}
            {showModal && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowModal(false);
                    }}
                >
                    <div className="modal" style={{ maxWidth: 620 }}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editing ? "✏️ Edit Product" : "➕ Add New Product"}
                            </h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* ── Image uploader ── */}
                            <div className="form-group">
                                <label className="form-label">Product Image</label>
                                <ImageUploader
                                    value={form.image_url}
                                    onChange={(url) => setForm({ ...form, image_url: url })}
                                />
                            </div>

                            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0" }} />

                            {/* ── Name ── */}
                            <div className="form-group">
                                <label className="form-label">Product Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., Premium Floating Fish Feed"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>

                            {/* ── Description ── */}
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Brief product description..."
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({ ...form, description: e.target.value })
                                    }
                                    style={{ height: 80 }}
                                />
                            </div>

                            {/* ── Category + Protein ── */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Category *</label>
                                    <select
                                        className="form-select"
                                        value={form.category_id}
                                        onChange={(e) =>
                                            setForm({ ...form, category_id: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Protein %</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. 28%"
                                        value={form.protein_percent}
                                        onChange={(e) =>
                                            setForm({ ...form, protein_percent: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            {/* ── Size + Price ── */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Pellet Size</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. 2-3mm"
                                        value={form.size}
                                        onChange={(e) => setForm({ ...form, size: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price (₹ / kg)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        value={form.price}
                                        onChange={(e) =>
                                            setForm({ ...form, price: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            {/* ── Active toggle ── */}
                            <div className="form-group">
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        cursor: "pointer",
                                        padding: "10px 14px",
                                        background: "var(--background)",
                                        borderRadius: 10,
                                        border: "1px solid var(--border)",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.is_active as boolean}
                                        onChange={(e) =>
                                            setForm({ ...form, is_active: e.target.checked })
                                        }
                                        style={{ width: 18, height: 18, cursor: "pointer" }}
                                    />
                                    <span>
                                        <span className="form-label" style={{ margin: 0 }}>
                                            Active — visible on website
                                        </span>
                                        <span
                                            style={{
                                                display: "block",
                                                fontSize: 12,
                                                color: "var(--text-muted)",
                                                fontWeight: 400,
                                            }}
                                        >
                                            Uncheck to hide this product from the public catalog
                                        </span>
                                    </span>
                                </label>
                            </div>

                            {/* ── Actions ── */}
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
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Saving..."
                                        : editing
                                            ? "💾 Save Changes"
                                            : "➕ Add Product"}
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
