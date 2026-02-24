"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../components/AdminSidebar";

interface Order {
    id: number;
    customer_name: string;
    phone: string;
    product: { name: string };
    quantity: string;
    district: string;
    state: string;
    pincode: string;
    address: string;
    notes?: string;
    status: string;
    createdAt: string;
}

const statusOptions = ["PENDING", "CONTACTED", "COMPLETED", "CANCELLED"];
const statusClass: Record<string, string> = {
    PENDING: "badge-pending",
    CONTACTED: "badge-contacted",
    COMPLETED: "badge-completed",
    CANCELLED: "badge-cancelled",
};

export default function AdminOrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filter, setFilter] = useState("ALL");
    const [selected, setSelected] = useState<Order | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") { router.push("/admin/login"); return; }
        if (status === "authenticated") fetchOrders();
    }, [status, router]);

    const fetchOrders = async () => {
        const res = await fetch("/api/admin/orders");
        setOrders(await res.json());
    };

    const updateStatus = async (id: number, newStatus: string) => {
        const res = await fetch(`/api/admin/orders/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
            showToast("success", "Status updated!");
            fetchOrders();
            if (selected?.id === id) setSelected({ ...selected, status: newStatus });
        }
    };

    const deleteOrder = async (id: number) => {
        if (!confirm("Delete this order?")) return;
        const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
        if (res.ok) {
            showToast("success", "Order deleted.");
            fetchOrders();
            setSelected(null);
        }
    };

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

    if (status === "loading" || !session) return null;

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-content">
                <div className="admin-topbar">
                    <h1 className="admin-topbar-title">📦 Order Enquiries</h1>
                    <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                        {orders.length} total orders
                    </span>
                </div>
                <main className="admin-main">
                    {/* Filter Tabs */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                        {["ALL", ...statusOptions].map((s) => (
                            <button
                                key={s}
                                className={`btn btn-sm ${filter === s ? "btn-primary" : "btn-outline"}`}
                                onClick={() => setFilter(s)}
                            >
                                {s} {s !== "ALL" && `(${orders.filter((o) => o.status === s).length})`}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 20 }}>
                        <div className="data-card">
                            <div className="data-card-header">
                                <h2 className="data-card-title">Orders ({filtered.length})</h2>
                            </div>
                            {filtered.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">📭</div>
                                    <p className="empty-state-text">No orders in this category</p>
                                </div>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Customer</th>
                                            <th>Phone</th>
                                            <th>Product</th>
                                            <th>Pincode</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((order) => (
                                            <tr
                                                key={order.id}
                                                style={{ cursor: "pointer", background: selected?.id === order.id ? "#f0f9ff" : "" }}
                                                onClick={() => setSelected(order)}
                                            >
                                                <td><strong>{order.customer_name}</strong></td>
                                                <td>
                                                    <a
                                                        href={`https://wa.me/91${order.phone.replace(/\D/g, "")}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ color: "#25D366", textDecoration: "none" }}
                                                    >
                                                        💬 {order.phone}
                                                    </a>
                                                </td>
                                                <td>{order.product?.name}</td>
                                                <td>{order.pincode}</td>
                                                <td>
                                                    <span className={`badge ${statusClass[order.status]}`}>{order.status}</span>
                                                </td>
                                                <td>{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                                                <td>
                                                    <select
                                                        className="form-select"
                                                        style={{ padding: "4px 8px", fontSize: 12, width: "130px" }}
                                                        value={order.status}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => updateStatus(order.id, e.target.value)}
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

                        {/* Order Detail Panel */}
                        {selected && (
                            <div className="data-card" style={{ height: "fit-content" }}>
                                <div className="data-card-header">
                                    <h2 className="data-card-title">Order Details</h2>
                                    <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
                                </div>
                                <div style={{ padding: 20 }}>
                                    <div style={{ marginBottom: 16 }}>
                                        <span className={`badge ${statusClass[selected.status]}`}>{selected.status}</span>
                                    </div>
                                    {[
                                        { label: "Customer", value: selected.customer_name },
                                        { label: "Phone", value: selected.phone },
                                        { label: "Product", value: selected.product?.name },
                                        { label: "Quantity", value: selected.quantity },
                                        { label: "District", value: selected.district },
                                        { label: "State", value: selected.state },
                                        { label: "Pincode", value: selected.pincode },
                                        { label: "Address", value: selected.address },
                                        { label: "Notes", value: selected.notes || "—" },
                                        { label: "Date", value: new Date(selected.createdAt).toLocaleString("en-IN") },
                                    ].map((row) => (
                                        <div key={row.label} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                                                {row.label}
                                            </div>
                                            <div style={{ fontSize: 14, color: "var(--text-primary)", marginTop: 4 }}>{row.value}</div>
                                        </div>
                                    ))}
                                    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                                        <a
                                            href={`https://wa.me/91${selected.phone.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(selected.customer_name)}!%20This%20is%20AL%20Azeem%20Fish%20Feed.%20Regarding%20your%20order%20for%20${encodeURIComponent(selected.product?.name)}.`}
                                            className="btn btn-whatsapp"
                                            style={{ flex: 1 }}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            💬 WhatsApp
                                        </a>
                                        <button
                                            className="btn btn-sm"
                                            style={{ background: "#fee2e2", color: "#dc2626", border: "none" }}
                                            onClick={() => deleteOrder(selected.id)}
                                        >
                                            🗑️ Delete
                                        </button>
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
