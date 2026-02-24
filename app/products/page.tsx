"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import OrderModal from "../components/OrderModal";

interface Product {
    id: number;
    name: string;
    description?: string;
    category: { name: string };
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

const productEmojis: Record<string, string> = {
    "Floating Fish Feed": "🐟",
    "Sinking Fish Feed": "🐠",
    "Shrimp Feed": "🦐",
    "Starter Feed": "🐟",
    "Grower Feed": "🐡",
    "Finisher Feed": "🐠",
};

function ProductsContent() {
    const searchParams = useSearchParams();
    const initialCategoryId = searchParams.get("categoryId");

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        initialCategoryId ? Number(initialCategoryId) : null
    );
    const [loading, setLoading] = useState(true);
    const [orderModalProduct, setOrderModalProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (initialCategoryId) {
            setSelectedCategory(Number(initialCategoryId));
        }
    }, [initialCategoryId]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
        } catch { }
        setLoading(false);
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch { }
    };

    const filtered = selectedCategory
        ? products.filter((p) => p.category?.name === categories.find(c => c.id === selectedCategory)?.name)
        : products;

    const getWhatsAppLink = (product: Product) => {
        const msg = `Hello! I'm interested in ordering *${product.name}*${product.size ? ` (Size: ${product.size})` : ""}${product.price ? ` - Price: ₹${product.price}/kg` : ""}. Please share more details.`;
        return `https://wa.me/917865055431?text=${encodeURIComponent(msg)}`;
    };

    const getEmoji = (name: string): string => {
        for (const [key, emoji] of Object.entries(productEmojis)) {
            if (name.toLowerCase().includes(key.toLowerCase().split(" ")[0].toLowerCase())) return emoji;
        }
        return "🐟";
    };

    return (
        <>
            <Header />

            {/* Page Hero */}
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
                        🏪 Product Catalog
                    </span>
                    <h1
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(32px, 5vw, 48px)",
                            fontWeight: 800,
                            marginBottom: 16,
                        }}
                    >
                        Our Products
                    </h1>
                    <p style={{ fontSize: 17, opacity: 0.85, lineHeight: 1.7 }}>
                        Browse our complete range of premium fish feed products. All products
                        are lab-tested and scientifically formulated.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <section className="section section-alt">
                <div className="section-inner">
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32, alignItems: "center" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)" }}>
                            Filter by:
                        </span>
                        <button
                            className={`btn btn-sm ${selectedCategory === null ? "btn-primary" : "btn-outline"}`}
                            onClick={() => setSelectedCategory(null)}
                        >
                            All Products
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={`btn btn-sm ${selectedCategory === cat.id ? "btn-primary" : "btn-outline"}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--text-muted)" }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
                            <p>Loading products...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🐟</div>
                            <p className="empty-state-text">No products found</p>
                            <p className="empty-state-sub">Check back soon or contact us for more info</p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {filtered.map((product) => (
                                <div key={product.id} className="product-card">
                                    <div className="product-image">
                                        {product.image_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={product.image_url} alt={product.name} />
                                        ) : (
                                            <span style={{ fontSize: 64 }}>{getEmoji(product.name)}</span>
                                        )}
                                        {product.protein_percent && (
                                            <span className="product-badge">{product.protein_percent} Protein</span>
                                        )}
                                    </div>
                                    <div className="product-body">
                                        <p className="product-category">{product.category?.name}</p>
                                        <h3 className="product-name">{product.name}</h3>
                                        {product.description && (
                                            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12, lineHeight: 1.5 }}>
                                                {product.description}
                                            </p>
                                        )}
                                        <div className="product-specs">
                                            {product.protein_percent && (
                                                <span className="spec-tag">🧬 {product.protein_percent} Protein</span>
                                            )}
                                            {product.size && (
                                                <span className="spec-tag">📏 Size: {product.size}</span>
                                            )}
                                        </div>
                                        {product.price && (
                                            <p className="product-price">
                                                ₹{product.price.toFixed(0)} <span>/ kg</span>
                                            </p>
                                        )}
                                        <div className="product-actions">
                                            <button
                                                onClick={() => setOrderModalProduct(product)}
                                                className="btn btn-whatsapp"
                                                style={{ flex: 1 }}
                                            >
                                                💬 Order Now
                                            </button>
                                            <Link
                                                href={`/contact?product=${encodeURIComponent(product.name)}`}
                                                className="btn btn-outline"
                                            >
                                                Enquire
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="cta-section">
                <h2 className="cta-title">Need a Custom Order?</h2>
                <p className="cta-desc">
                    We offer bulk discounts and customized packaging. Get in touch today!
                </p>
                <div className="cta-actions">
                    <a
                        href="https://wa.me/917865055431?text=I need a custom bulk order quote."
                        className="btn btn-whatsapp btn-lg"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        💬 Contact on WhatsApp
                    </a>
                    <Link href="/dealer" className="btn btn-outline" style={{ color: "white", borderColor: "rgba(255,255,255,0.4)" }}>
                        Become a Dealer
                    </Link>
                </div>
            </section>

            <Footer />
            <OrderModal
                isOpen={!!orderModalProduct}
                onClose={() => setOrderModalProduct(null)}
                product={orderModalProduct}
            />
        </>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div style={{ padding: "100px 24px", textAlign: "center", color: "var(--text-muted)" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
                <p>Loading...</p>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
