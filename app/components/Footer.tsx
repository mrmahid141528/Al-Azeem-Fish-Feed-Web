import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-grid">
                    {/* Brand */}
                    <div className="footer-brand">
                        <Link href="/" className="logo" style={{ marginBottom: 12 }}>
                            <div
                                className="logo-icon"
                                style={{ width: 38, height: 38, fontSize: 18 }}
                            >
                                🐟
                            </div>
                            <div className="logo-text">
                                <span className="logo-name">AL Azeem</span>
                                <span
                                    className="logo-tagline"
                                    style={{ color: "#64748b" }}
                                >
                                    Fish Feed Industries
                                </span>
                            </div>
                        </Link>
                        <p className="footer-desc">
                            Providing premium quality fish feed products to aquaculture
                            farmers across India. Trusted by thousands of fish farmers for
                            over a decade.
                        </p>
                        <div className="footer-social">
                            <a
                                href="https://wa.me/917865055431"
                                className="social-link"
                                title="WhatsApp"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                💬
                            </a>
                            <a href="mailto:info@alazeem.in" className="social-link" title="Email">
                                📧
                            </a>
                            <a href="tel:+917865055431" className="social-link" title="Phone">
                                📞
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="footer-col-title">Quick Links</h3>
                        <ul className="footer-links">
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/products">Products</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                            <li><Link href="/dealer">Become a Dealer</Link></li>
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="footer-col-title">Products</h3>
                        <ul className="footer-links">
                            <li><Link href="/products">Floating Fish Feed</Link></li>
                            <li><Link href="/products">Sinking Fish Feed</Link></li>
                            <li><Link href="/products">Shrimp Feed</Link></li>
                            <li><Link href="/products">Starter Feed</Link></li>
                            <li><Link href="/products">Grower Feed</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="footer-col-title">Contact Us</h3>
                        <ul className="footer-links" style={{ gap: 14 }}>
                            <li>
                                <span style={{ color: "#64748b", display: "block", fontSize: 12 }}>
                                    WhatsApp / Phone
                                </span>
                                <a href="tel:+917865055431">+91 78650 55431</a>
                            </li>
                            <li>
                                <span style={{ color: "#64748b", display: "block", fontSize: 12 }}>
                                    Email
                                </span>
                                <a href="mailto:info@alazeem.in">info@alazeem.in</a>
                            </li>
                            <li>
                                <span style={{ color: "#64748b", display: "block", fontSize: 12 }}>
                                    Address
                                </span>
                                <span style={{ fontSize: 14 }}>
                                    Industrial Area, Punjab, India
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>
                        © {currentYear} AL Azeem Fish Feed Industries. All rights reserved.
                    </p>
                    <p style={{ fontSize: 13, color: "#475569" }}>
                        Made with ❤️ for Indian Fish Farmers
                    </p>
                </div>
            </div>
        </footer>
    );
}
