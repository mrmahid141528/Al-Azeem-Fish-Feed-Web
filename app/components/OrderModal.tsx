"use client";
import { useState, useEffect } from "react";

interface Product {
    id: number;
    name: string;
    protein_percent?: string;
    size?: string;
    price?: number;
}

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}

export default function OrderModal({ isOpen, onClose, product }: OrderModalProps) {
    const [step, setStep] = useState<1 | 2>(1);

    // Step 1: Pincode check
    const [pincode, setPincode] = useState("");
    const [loading, setLoading] = useState(false);
    const [pincodeError, setPincodeError] = useState("");
    const [areaName, setAreaName] = useState("");

    // Step 2: Form details
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        quantity: "",
        address: "",
    });

    // Reset when opened/closed
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setPincode("");
            setPincodeError("");
            setAreaName("");
            setFormData({ name: "", phone: "", quantity: "", address: "" });
        }
    }, [isOpen]);

    if (!isOpen || !product) return null;

    const checkPincode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pincode.length !== 6) {
            setPincodeError("Please enter a valid 6-digit PIN code.");
            return;
        }

        setLoading(true);
        setPincodeError("");
        try {
            const res = await fetch(`/api/check-pincode?code=${pincode}`);
            const data = await res.json();
            if (data.available) {
                setAreaName(data.area || pincode);
                setStep(2);
            } else {
                setPincodeError(`Sorry, delivery is currently not available for PIN code ${pincode}. Please contact us on WhatsApp directly for bulk transportation queries.`);
            }
        } catch {
            setPincodeError("Error checking pincode. Please try again.");
        }
        setLoading(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const details = [
            `*New Order Request*`,
            `-------------------`,
            `*Product:* ${product.name}`,
            product.size ? `*Size:* ${product.size}` : "",
            product.protein_percent ? `*Protein:* ${product.protein_percent}` : "",
            product.price ? `*Price:* ₹${product.price}/kg` : "",
            `*Quantity Needed:* ${formData.quantity}`,
            `-------------------`,
            `*Customer Details*`,
            `*Name:* ${formData.name}`,
            `*Phone:* ${formData.phone}`,
            `*Address:* ${formData.address}`,
            `*Pincode:* ${pincode} (${areaName})`,
        ].filter(Boolean).join("%0A"); // %0A is newline in URL encoding

        const whatsappUrl = `https://wa.me/917865055431?text=${details}`;

        window.open(whatsappUrl, "_blank");
        onClose(); // Close modal after opening WhatsApp
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal" style={{ maxWidth: 500 }}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {step === 1 ? "📍 Check Delivery Availability" : "📝 Complete Your Order"}
                    </h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div style={{ padding: 20 }}>
                    {/* Selected Product Info */}
                    <div style={{ background: "var(--primary-light)", padding: "12px 16px", borderRadius: 8, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <p style={{ fontSize: 13, color: "var(--primary)", fontWeight: 700, marginBottom: 4 }}>SELECTED PRODUCT</p>
                            <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>{product.name}</p>
                        </div>
                        {product.price && (
                            <div style={{ textAlign: "right", fontWeight: 700, color: "var(--text-primary)" }}>
                                ₹{product.price}/kg
                            </div>
                        )}
                    </div>

                    {step === 1 ? (
                        <form onSubmit={checkPincode}>
                            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>
                                Please enter your delivery PIN code to check if we can ship to your location.
                            </p>
                            <div className="form-group">
                                <label className="form-label">Delivery PIN Code *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., 400001"
                                    maxLength={6}
                                    value={pincode}
                                    onChange={(e) => {
                                        setPincode(e.target.value.replace(/\D/g, ""));
                                        setPincodeError("");
                                    }}
                                    autoFocus
                                    required
                                />
                            </div>

                            {pincodeError && (
                                <div style={{ padding: 12, background: "#fee2e2", color: "#b91c1c", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                                    ❌ {pincodeError}
                                    {pincodeError.includes("not available") && (
                                        <div style={{ marginTop: 8 }}>
                                            <a
                                                href={`https://wa.me/917865055431?text=Hello,%20I%20want%20to%20order%20${encodeURIComponent(product.name)},%20but%20my%20pincode%20(${pincode})%20shows%20delivery%20not%20available.%20Can%20we%20arrange%20transport?`}
                                                className="btn btn-sm btn-whatsapp"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ display: "inline-block" }}
                                            >
                                                Chat on WhatsApp
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: "100%", padding: 14 }}
                                disabled={loading || pincode.length !== 6}
                            >
                                {loading ? "Checking..." : "Check Availability →"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div style={{ padding: "8px 12px", background: "#dcfce7", color: "#166534", borderRadius: 8, fontSize: 13, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                                <span>✅</span> Delivery available to <strong>{areaName} ({pincode})</strong>
                                <button type="button" onClick={() => setStep(1)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#166534", textDecoration: "underline", cursor: "pointer", fontSize: 12 }}>Change</button>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Your Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Phone / WhatsApp *</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        placeholder="Mobile number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Quantity Needed *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g., 50 Bags or 2000 KG"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Full Delivery Address *</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="House/Shop No., Street, Area..."
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows={3}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-whatsapp"
                                style={{ width: "100%", padding: 14, fontSize: 16 }}
                            >
                                💬 Submit Order via WhatsApp
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
