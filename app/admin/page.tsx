"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";

interface Stats {
    products: number;
    orders: number;
    pincodes: number;
    dealers: number;
    pendingOrders: number;
}

interface RecentOrder {
    id: number;
    customer_name: string;
    phone: string;
    pincode: string;
    status: string;
    createdAt: string;
    product: { name: string };
}

export default function AdminDashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

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
        try {
            const [statsRes, ordersRes] = await Promise.all([
                fetch("/api/admin/stats"),
                fetch("/api/admin/orders"),
            ]);
            const statsData = await statsRes.json();
            const ordersData = await ordersRes.json();
            setStats(statsData);
            setRecentOrders(ordersData.slice(0, 5));
        } catch { }
    };

    if (status === "loading" || !session) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#f1f5f9" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        { icon: "🐟", label: "Total Products", value: stats?.products ?? "—", color: "stat-icon-blue" },
        { icon: "📦", label: "Total Orders", value: stats?.orders ?? "—", color: "stat-icon-green" },
        { icon: "⏳", label: "Pending Orders", value: stats?.pendingOrders ?? "—", color: "stat-icon-orange" },
        { icon: "🤝", label: "Dealer Requests", value: stats?.dealers ?? "—", color: "stat-icon-purple" },
    ];

    const statusClass: Record<string, string> = {
        PENDING: "badge-pending",
        CONTACTED: "badge-contacted",
        COMPLETED: "badge-completed",
        CANCELLED: "badge-cancelled",
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-content">
                <div className="admin-topbar">
                    <h1 className="admin-topbar-title">Dashboard</h1>
                    <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
                        Welcome back, <strong>{session.user?.name}</strong>! 👋
                    </div>
                </div>
                <main className="admin-main">
                    {/* Stats */}
                    <div className="stats-grid">
                        {statCards.map((s, i) => (
                            <div key={i} className="stat-card">
                                <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                                <div className="stat-info">
                                    <div className="stat-number">{s.value}</div>
                                    <div className="stat-label">{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Orders */}
                    <div className="data-card">
                        <div className="data-card-header">
                            <h2 className="data-card-title">📦 Recent Orders</h2>
                            <a href="/admin/orders" className="btn btn-sm btn-outline">View All</a>
                        </div>
                        {recentOrders.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📭</div>
                                <p className="empty-state-text">No orders yet</p>
                                <p className="empty-state-sub">Orders will appear here as customers submit enquiries</p>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td><strong>{order.customer_name}</strong></td>
                                            <td>
                                                <a href={`https://wa.me/91${order.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", textDecoration: "none" }}>
                                                    {order.phone}
                                                </a>
                                            </td>
                                            <td>{order.product?.name}</td>
                                            <td>{order.pincode}</td>
                                            <td>
                                                <span className={`badge ${statusClass[order.status] || "badge-pending"}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
