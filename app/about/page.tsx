import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us - AL Azeem Fish Feed Industries",
    description: "Learn about AL Azeem Fish Feed Industries - our story, mission, and commitment to quality aquaculture feed.",
};

export default function AboutPage() {
    return (
        <>
            <Header />

            {/* Hero */}
            <div
                style={{
                    background: "linear-gradient(135deg, #0c4a6e, #0e7490)",
                    color: "white",
                    padding: "60px 24px",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                    <span
                        style={{
                            display: "inline-block",
                            background: "rgba(255,255,255,0.15)",
                            padding: "6px 16px",
                            borderRadius: 50,
                            fontSize: 13,
                            marginBottom: 16,
                        }}
                    >
                        🌊 Our Story
                    </span>
                    <h1
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(32px, 5vw, 48px)",
                            fontWeight: 800,
                            marginBottom: 16,
                        }}
                    >
                        About AL Azeem
                    </h1>
                    <p style={{ fontSize: 17, opacity: 0.85, lineHeight: 1.7 }}>
                        A decade of dedication to quality aquaculture feed and support for
                        India&apos;s fish farming community.
                    </p>
                </div>
            </div>

            {/* Mission */}
            <section className="section">
                <div className="section-inner">
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 60,
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <div>
                            <span className="section-label">Our Mission</span>
                            <h2 className="section-title" style={{ textAlign: "left", marginTop: 12 }}>
                                Empowering Fish Farmers with Premium Nutrition
                            </h2>
                            <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 20 }}>
                                AL Azeem Fish Feed Industries was founded with a single mission:
                                to provide Indian fish farmers with world-class, affordable
                                aquaculture feed that maximizes growth, minimizes waste, and
                                supports sustainable farming.
                            </p>
                            <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 28 }}>
                                Over the past decade, we have grown from a small local supplier
                                to one of the most trusted names in fish feed across multiple
                                states in India, serving over 5,000 farmers.
                            </p>
                            <Link href="/contact" className="btn btn-primary btn-lg">
                                Get in Touch
                            </Link>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            {[
                                { icon: "🏆", label: "10+ Years", sub: "In the industry" },
                                { icon: "👨‍🌾", label: "5000+", sub: "Happy farmers" },
                                { icon: "🌍", label: "15+ States", sub: "Delivery coverage" },
                                { icon: "🔬", label: "Lab Tested", sub: "Every single batch" },
                            ].map((s, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: "var(--primary-light)",
                                        borderRadius: 16,
                                        padding: "28px 20px",
                                        textAlign: "center",
                                    }}
                                >
                                    <div style={{ fontSize: 36, marginBottom: 10 }}>{s.icon}</div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: "var(--primary-dark)" }}>
                                        {s.label}
                                    </div>
                                    <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                                        {s.sub}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section section-alt">
                <div className="section-inner">
                    <div className="section-header">
                        <span className="section-label">Our Values</span>
                        <h2 className="section-title">What We Stand For</h2>
                    </div>
                    <div className="features-grid">
                        {[
                            {
                                icon: "🔬",
                                title: "Scientific Excellence",
                                desc: "Our products are formulated by aquaculture nutritionists using the latest research in fish nutrition and feed science.",
                            },
                            {
                                icon: "✅",
                                title: "Uncompromising Quality",
                                desc: "Every batch of feed undergoes rigorous quality testing for protein content, moisture, and nutritional value.",
                            },
                            {
                                icon: "🤝",
                                title: "Farmer First",
                                desc: "We provide fair prices, honest guidance, and excellent after-sales support to every farmer, big or small.",
                            },
                            {
                                icon: "🌱",
                                title: "Sustainability",
                                desc: "We source ingredients responsibly and design feeds that promote healthy water quality and environmental sustainability.",
                            },
                        ].map((v, i) => (
                            <div key={i} className="feature-card">
                                <div className="feature-icon">{v.icon}</div>
                                <h3 className="feature-title">{v.title}</h3>
                                <p className="feature-desc">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="section">
                <div className="section-inner">
                    <div className="section-header">
                        <span className="section-label">Our Team</span>
                        <h2 className="section-title">Meet the Experts</h2>
                        <p className="section-desc">
                            Our team of aquaculture specialists and nutritionists work
                            tirelessly to bring you the best feed formulations.
                        </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>
                        {[
                            { name: "Mohammed Azeem", role: "Founder & CEO", emoji: "👨‍💼" },
                            { name: "Dr. Sarfaraz Khan", role: "Head of Nutrition", emoji: "🔬" },
                            { name: "Priya Sharma", role: "Quality Control", emoji: "✅" },
                            { name: "Rahul Verma", role: "Sales & Distribution", emoji: "🚛" },
                        ].map((m, i) => (
                            <div
                                key={i}
                                style={{
                                    background: "white",
                                    borderRadius: 16,
                                    padding: 28,
                                    textAlign: "center",
                                    border: "1px solid var(--border)",
                                    boxShadow: "var(--shadow-sm)",
                                    transition: "all 0.3s",
                                }}
                            >
                                <div
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, var(--primary-light), #bae6fd)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 36,
                                        margin: "0 auto 16px",
                                    }}
                                >
                                    {m.emoji}
                                </div>
                                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{m.name}</div>
                                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{m.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <h2 className="cta-title">Ready to Partner With Us?</h2>
                <p className="cta-desc">
                    Whether you&apos;re a small-scale farmer or a large aquaculture enterprise,
                    we have the perfect feed solution for you.
                </p>
                <div className="cta-actions">
                    <Link href="/products" className="btn btn-accent btn-lg">View Products</Link>
                    <Link href="/contact" className="btn btn-outline" style={{ color: "white", borderColor: "rgba(255,255,255,0.4)" }}>Contact Us</Link>
                </div>
            </section>

            <Footer />
        </>
    );
}
