"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { href: "/", label: "Home" },
        { href: "/products", label: "Products" },
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <header className={`site-header${scrolled ? " scrolled" : ""}`}>
            <div className="header-inner">
                <Link href="/" className="logo">
                    <div className="logo-icon">🐟</div>
                    <div className="logo-text">
                        <span className="logo-name">AL Azeem</span>
                        <span className="logo-tagline">Fish Feed Industries</span>
                    </div>
                </Link>

                <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ul className="nav-links">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={pathname === item.href ? "active" : ""}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <Link
                        href="/contact"
                        className="btn btn-primary"
                        style={{ marginLeft: 8 }}
                    >
                        Get a Quote
                    </Link>
                </nav>
            </div>
        </header>
    );
}
