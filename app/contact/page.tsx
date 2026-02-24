"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ContactForm() {
    const searchParams = useSearchParams();
    const productParam = searchParams.get("product") || "";

    const [formData, setFormData] = useState({
        customer_name: "",
        phone: "",
        product_name: productParam,
        quantity: "",
        district: "",
        state: "",
        pincode: "",
        address: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (productParam) {
            setFormData((prev) => ({ ...prev, product_name: productParam }));
        }
    }, [productParam]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/inquire", {
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

    if (success) {
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "80px 24px",
                    background: "white",
                    borderRadius: 20,
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-md)",
                }}
            >
                <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
                    Enquiry Submitted!
                </h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.7 }}>
                    Thank you, {formData.customer_name}! We&apos;ve received your enquiry and will
                    contact you on WhatsApp/phone within 24 hours.
                </p>
                <a
                    href={`https://wa.me/917865055431?text=Hello!%20I%20just%20submitted%20an%20enquiry%20for%20${encodeURIComponent(formData.product_name || "fish feed")}%20and%20my%20name%20is%20${encodeURIComponent(formData.customer_name)}.`}
                    className="btn btn-whatsapp btn-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    💬 Also reach us on WhatsApp
                </a>
            </div>
        );
    }

    return (
        <div className="form-card">
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Send an Enquiry</h2>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28 }}>
                Fill out the form below and we&apos;ll get back to you within 24 hours.
            </p>
            {error && <div className="error-msg">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                            type="text"
                            name="customer_name"
                            className="form-input"
                            placeholder="Your full name"
                            value={formData.customer_name}
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
                        <label className="form-label">Product of Interest</label>
                        <input
                            type="text"
                            name="product_name"
                            className="form-input"
                            placeholder="e.g., Floating Fish Feed"
                            value={formData.product_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Quantity Required</label>
                        <input
                            type="text"
                            name="quantity"
                            className="form-input"
                            placeholder="e.g., 100 kg, 5 bags"
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">District *</label>
                        <input
                            type="text"
                            name="district"
                            className="form-input"
                            placeholder="Your district"
                            value={formData.district}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">State *</label>
                        <input
                            type="text"
                            name="state"
                            className="form-input"
                            placeholder="Your state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Pincode *</label>
                        <input
                            type="text"
                            name="pincode"
                            className="form-input"
                            placeholder="6-digit pincode"
                            maxLength={6}
                            value={formData.pincode}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Address *</label>
                        <input
                            type="text"
                            name="address"
                            className="form-input"
                            placeholder="Full address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Additional Notes</label>
                    <textarea
                        name="notes"
                        className="form-textarea"
                        placeholder="Any specific requirements or questions..."
                        value={formData.notes}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "14px" }}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "🚀 Submit Enquiry"}
                </button>
            </form>
        </div>
    );
}

export default function ContactPage() {
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
                        📞 Get in Touch
                    </span>
                    <h1
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(32px, 5vw, 48px)",
                            fontWeight: 800,
                            marginBottom: 16,
                        }}
                    >
                        Contact Us
                    </h1>
                    <p style={{ fontSize: 17, opacity: 0.85, lineHeight: 1.7 }}>
                        Have a question or want to place an order? We&apos;re here to help!
                    </p>
                </div>
            </div>

            {/* Contact Section */}
            <section className="section">
                <div className="section-inner">
                    <div className="contact-grid">
                        {/* Info */}
                        <div>
                            <div className="contact-info-card">
                                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 28, color: "white" }}>
                                    Reach Us Directly
                                </h2>
                                {[
                                    {
                                        icon: "💬",
                                        label: "WhatsApp",
                                        value: "+91 98765 43210",
                                        link: "https://wa.me/917865055431",
                                    },
                                    {
                                        icon: "📞",
                                        label: "Phone",
                                        value: "+91 98765 43210",
                                        link: "tel:+917865055431",
                                    },
                                    {
                                        icon: "📧",
                                        label: "Email",
                                        value: "info@alazeem.in",
                                        link: "mailto:info@alazeem.in",
                                    },
                                    {
                                        icon: "📍",
                                        label: "Address",
                                        value: "Industrial Area, Punjab, India",
                                    },
                                    {
                                        icon: "⏰",
                                        label: "Business Hours",
                                        subtitle: "Mon-Sat: 9AM - 6PM",
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="contact-item">
                                        <div className="contact-icon">{item.icon}</div>
                                        <div>
                                            <div className="contact-label">{item.label}</div>
                                            {item.link ? (
                                                <a
                                                    href={item.link}
                                                    className="contact-value"
                                                    style={{ color: "white", textDecoration: "none" }}
                                                    target={item.link.startsWith("http") ? "_blank" : undefined}
                                                    rel="noopener noreferrer"
                                                >
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <div className="contact-value">{item.value}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                                    <p style={{ fontSize: 13, opacity: 0.75, marginBottom: 16 }}>
                                        For fastest response, reach us on WhatsApp:
                                    </p>
                                    <a
                                        href="https://wa.me/917865055431?text=Hello!%20I%27d%20like%20to%20inquire%20about%20your%20fish%20feed%20products."
                                        className="btn btn-whatsapp"
                                        style={{ width: "100%" }}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        💬 Open WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <Suspense fallback={<div>Loading form...</div>}>
                            <ContactForm />
                        </Suspense>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
