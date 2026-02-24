"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
    { href: "/admin/categories", label: "Categories", icon: "🗂️" },
    { href: "/admin/products", label: "Products", icon: "🐟" },
    { href: "/admin/orders", label: "Orders", icon: "📦" },
    { href: "/admin/pincodes", label: "Pincodes", icon: "📍" },
    { href: "/admin/dealers", label: "Dealers", icon: "🤝" },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated" && pathname !== "/admin/login") {
            router.push("/admin/login");
        }
    }, [status, pathname, router]);

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            background: "linear-gradient(135deg, #0e7490, #0c4a6e)",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 18,
                        }}
                    >
                        🐟
                    </div>
                    <div>
                        <div className="sidebar-logo-name">AL Azeem</div>
                        <div className="sidebar-logo-tag">Admin Panel</div>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                <p className="sidebar-section-label">Navigation</p>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`sidebar-link${isActive(item.href, item.exact) ? " active" : ""}`}
                    >
                        <span className="sidebar-link-icon">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}

                <p className="sidebar-section-label" style={{ marginTop: 32 }}>Quick Links</p>
                <Link
                    href="/"
                    className="sidebar-link"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className="sidebar-link-icon">🌐</span>
                    View Website
                </Link>
            </nav>

            <div className="sidebar-bottom">
                {session && (
                    <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>Logged in as</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>
                            {session.user?.name}
                        </div>
                    </div>
                )}
                <button
                    className="btn btn-outline"
                    style={{
                        width: "100%",
                        color: "#94a3b8",
                        borderColor: "rgba(255,255,255,0.1)",
                        fontSize: 13,
                    }}
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                >
                    🚪 Sign Out
                </button>
            </div>
        </aside>
    );
}
