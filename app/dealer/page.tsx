"use client";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function DealerPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        business: "",
        city: "",
        details: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/dealer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setSuccess(true);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } catch {
            setError("Network error. Please try again.");
        }
        setLoading(false);
    };

    return (
        <>
            <Header />

            {/* Hero */}
            <div
                style={{
                    background: "linear-gradient(135deg, #f97316, #ea580c)",
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
                        🤝 Partnership Opportunity
                    </span>
                    <h1
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(32px, 5vw, 48px)",
                            fontWeight: 800,
                            marginBottom: 16,
                        }}
                    >
                        Become an AL Azeem Dealer
                    </h1>
                    <p style={{ fontSize: 17, opacity: 0.9, lineHeight: 1.7 }}>
                        Join our growing network of authorized dealers across India and build
                        a profitable business selling premium fish feed.
                    </p>
                </div>
            </div>

            {/* Benefits */}
            <section className="section">
                <div className="section-inner">
                    <div className="section-header">
                        <span className="section-label" style={{ background: "#ffedd5", color: "#c2410c" }}>Dealer Benefits</span>
                        <h2 className="section-title">Why Partner With Us?</h2>
                    </div>
                    <div className="features-grid">
                        {[
                            { icon: "💰", title: "Higher Margins", desc: "Exclusive dealer pricing with attractive margins on every sale." },
                            { icon: "📦", title: "Stock Support", desc: "Priority stock allocation and timely delivery to your location." },
                            { icon: "📣", title: "Marketing Support", desc: "Promotional materials, banners, and digital marketing assistance." },
                            { icon: "🎓", title: "Training", desc: "Product knowledge training and sales support from our team." },
                            { icon: "🚀", title: "Exclusive Territory", desc: "Protected territory rights for authorized dealers." },
                            { icon: "🏅", title: "Brand Association", desc: "Partner with a 10+ year trusted brand in the aquaculture industry." },
                        ].map((b, i) => (
                            <div key={i} className="feature-card">
                                <div className="feature-icon" style={{ background: "#ffedd5" }}>{b.icon}</div>
                                <h3 className="feature-title">{b.title}</h3>
                                <p className="feature-desc">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Application Form */}
            <section className="section section-alt">
                <div className="section-inner">
                    <div style={{ maxWidth: 640, margin: "0 auto" }}>
                        {success ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    background: "white",
                                    borderRadius: 20,
                                    padding: "60px 40px",
                                    border: "1px solid var(--border)",
                                    boxShadow: "var(--shadow-md)",
                                }}
                            >
                                <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Application Received!</h2>
                                <p style={{ color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.7 }}>
                                    Thank you for your interest in becoming an AL Azeem dealer.
                                    Our team will review your application and contact you within 2–3 business days.
                                </p>
                                <a
                                    href={"https://wa.me/917865055431?text=Hello!%20I%20just%20submitted%20a%20dealer%20application.%20My%20name%20is%20" + encodeURIComponent(formData.name)}
                                    className="btn btn-whatsapp btn-lg"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    💬 Connect on WhatsApp
                                </a>
                            </div>
                        ) : (
                            <div className="form-card">
                                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Dealer Application Form</h2>
                                <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28 }}>
                                    Fill out the form below and our team will get in touch with you shortly.
                                </p>
                                {error && <div className="error-msg">{error}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-input"
                                                placeholder="Your full name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Phone / WhatsApp *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className="form-input"
                                                placeholder="+91 XXXXX XXXXX"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Business Name</label>
                                            <input
                                                type="text"
                                                name="business"
                                                className="form-input"
                                                placeholder="Your business / shop name"
                                                value={formData.business}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">City / District</label>
                                            <input
                                                type="text"
                                                name="city"
                                                className="form-input"
                                                placeholder="Your city or district"
                                                value={formData.city}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Tell Us About Your Business *</label>
                                        <textarea
                                            name="details"
                                            className="form-textarea"
                                            placeholder="Describe your business, experience, target market, and why you want to become an AL Azeem dealer..."
                                            value={formData.details}
                                            onChange={handleChange}
                                            required
                                            style={{ height: 140 }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-accent"
                                        style={{ width: "100%", padding: "14px", fontSize: 15 }}
                                        disabled={loading}
                                    >
                                        {loading ? "Submitting..." : "🚀 Submit Application"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </section >

            <Footer />
        </>
    );
}
