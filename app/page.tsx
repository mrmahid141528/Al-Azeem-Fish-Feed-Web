"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import OrderModal from "./components/OrderModal";

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
  image_url?: string;
}

const productEmojis: Record<string, string> = {
  "Floating Fish Feed": "🐟",
  "Sinking Fish Feed": "🐠",
  "Shrimp Feed": "🦐",
  "Starter Feed": "🐟",
  "Grower Feed": "🐡",
  "Finisher Feed": "🐠",
};

const heroProducts = [
  { emoji: "🐟", name: "Floating Fish Feed", detail: "28% Protein | 1-8mm" },
  { emoji: "🦐", name: "Shrimp Feed", detail: "38% Protein | 0.5-2mm" },
  { emoji: "🐠", name: "Starter Feed", detail: "40% Protein | 0.3-0.5mm" },
];

const features = [
  {
    icon: "🏆",
    title: "Premium Quality",
    desc: "High-protein formulas scientifically designed for maximum fish growth and health.",
  },
  {
    icon: "🚀",
    title: "Fast Delivery",
    desc: "Quick delivery across India. Check if your pincode is serviceable below.",
  },
  {
    icon: "💬",
    title: "WhatsApp Order",
    desc: "Simple ordering via WhatsApp. No complicated forms or long processes.",
  },
  {
    icon: "🌱",
    title: "Eco-Friendly",
    desc: "Sustainable ingredients that promote healthy aquaculture ecosystems.",
  },
  {
    icon: "💰",
    title: "Best Price",
    desc: "Competitive wholesale and retail pricing with dealer discounts.",
  },
  {
    icon: "🔬",
    title: "Lab Tested",
    desc: "Every batch rigorously tested for quality, protein content, and safety.",
  },
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Punjab, India",
    text: "AL Azeem fish feed has transformed my aquaculture farm. The growth rate of my fish improved by 30% within 2 months!",
    initials: "RK",
  },
  {
    name: "Suresh Patel",
    location: "Gujarat, India",
    text: "Excellent quality, timely delivery, and great customer support. Highly recommended for all fish farmers.",
    initials: "SP",
  },
  {
    name: "Mohammed Ali",
    location: "Andhra Pradesh, India",
    text: "Been using AL Azeem products for 3 years now. The consistency in quality is what keeps me coming back.",
    initials: "MA",
  },
];

export default function HomePage() {
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const [topCategories, setTopCategories] = useState<Category[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);

  const [orderModalProduct, setOrderModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setTopCategories(data.slice(0, 4)))
      .catch((e) => console.error(e));

    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setTopProducts(data.slice(0, 4)))
      .catch((e) => console.error(e));
  }, []);

  const checkPincode = async () => {
    if (!pincode || pincode.length < 6) return;
    setPincodeLoading(true);
    try {
      const res = await fetch(`/api/check-pincode?code=${pincode}`);
      const data = await res.json();
      if (data.available) {
        setPincodeResult({
          type: "success",
          message: `✅ Great news! We deliver to ${data.area || pincode}. Place your order via WhatsApp now!`,
        });
      } else {
        setPincodeResult({
          type: "error",
          message: `❌ Sorry, we don't currently deliver to pincode ${pincode}. Contact us to request delivery.`,
        });
      }
    } catch {
      setPincodeResult({
        type: "error",
        message: "Unable to check. Please try again.",
      });
    }
    setPincodeLoading(false);
  };

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

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-badge">🌊 India&apos;s Trusted Fish Feed Brand</div>
            <h1 className="hero-title">
              Premium Fish Feed for <span>Maximum Growth</span>
            </h1>
            <p className="hero-desc">
              Scientifically formulated, lab-tested fish feed products trusted
              by thousands of aquaculture farmers across India. Order directly
              via WhatsApp.
            </p>
            <div className="hero-actions">
              <Link href="/products" className="btn btn-accent btn-lg">
                🛒 Browse Products
              </Link>
              <a
                href="https://wa.me/917865055431?text=Hello!%20I%27m%20interested%20in%20your%20fish%20feed%20products."
                className="btn btn-whatsapp btn-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Order on WhatsApp
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">10+</span>
                <span className="hero-stat-label">Years Experience</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">5000+</span>
                <span className="hero-stat-label">Happy Farmers</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">15+</span>
                <span className="hero-stat-label">Products</span>
              </div>
            </div>
          </div>

          <div className="hero-image-area">
            <div className="hero-card">
              <p className="hero-card-title">🏪 Our Top Products</p>
              <div className="hero-product-list">
                {heroProducts.map((p, i) => (
                  <div key={i} className="hero-product-item">
                    <span className="hero-product-emoji">{p.emoji}</span>
                    <div className="hero-product-info">
                      <div className="hero-product-name">{p.name}</div>
                      <div className="hero-product-detail">{p.detail}</div>
                    </div>
                    <button
                      onClick={() => setOrderModalProduct(p as unknown as Product)}
                      style={{ fontSize: 20, background: "none", border: "none", cursor: "pointer" }}
                    >
                      💬
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP CATEGORIES */}
      {topCategories.length > 0 && (
        <section className="section section-alt">
          <div className="section-inner">
            <div
              className="section-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: 20,
              }}
            >
              <div style={{ textAlign: "left" }}>
                <span className="section-label">Our Selection</span>
                <h2 className="section-title">Shop by Category</h2>
                <p className="section-desc">Find the exact feed type suitable for your needs.</p>
              </div>
              <Link href="/products" className="btn btn-outline">
                See More Categories
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {topCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?categoryId=${cat.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      background: "white",
                      borderRadius: 16,
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      boxShadow: "var(--shadow-sm)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      alignItems: "stretch",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-sm)";
                    }}
                  >
                    <div
                      style={{
                        height: 180,
                        background: cat.image_url
                          ? `url(${cat.image_url}) center/cover`
                          : "linear-gradient(135deg, var(--primary-light), #bae6fd)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 64,
                      }}
                    >
                      {!cat.image_url && "🗂️"}
                    </div>
                    <div style={{ padding: 20, textAlign: "center" }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{cat.name}</h3>
                      <p style={{ fontSize: 13, color: "var(--primary)", marginTop: 8, fontWeight: 600 }}>
                        View Products →
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TOP PRODUCTS */}
      {topProducts.length > 0 && (
        <section className="section">
          <div className="section-inner">
            <div
              className="section-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                flexWrap: "wrap",
                gap: 20,
              }}
            >
              <div style={{ textAlign: "left", marginBottom: 0 }}>
                <span className="section-label">Best Sellers</span>
                <h2 className="section-title">Our Top Products</h2>
                <p className="section-desc" style={{ marginBottom: 0 }}>
                  High-protein, scientifically proven feed for your aquaculture.
                </p>
              </div>
              <Link href="/products" className="btn btn-primary">
                See All Products
              </Link>
            </div>
            <div className="products-grid">
              {topProducts.map((product) => (
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
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--text-secondary)",
                          marginBottom: 12,
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
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
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Why Choose Us</span>
            <h2 className="section-title">The AL Azeem Advantage</h2>
            <p className="section-desc">
              Trusted by fish farmers across India for quality, reliability, and
              excellent support.
            </p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PINCODE CHECKER */}
      <section className="section">
        <div className="section-inner">
          <div className="pincode-section">
            <span className="section-label">Delivery Check</span>
            <h2 className="section-title" style={{ marginTop: 12 }}>
              Check If We Deliver to You
            </h2>
            <p className="section-desc">
              Enter your 6-digit pincode to instantly check if we deliver
              to your area.
            </p>
            <div className="pincode-input-wrap">
              <input
                type="text"
                className="pincode-input"
                placeholder="Enter 6-digit pincode..."
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, ""));
                  setPincodeResult({ type: null, message: "" });
                }}
                onKeyDown={(e) => e.key === "Enter" && checkPincode()}
              />
              <button
                className="btn btn-primary"
                style={{ padding: "14px 24px" }}
                onClick={checkPincode}
                disabled={pincodeLoading || pincode.length < 6}
              >
                {pincodeLoading ? "Checking..." : "Check"}
              </button>
            </div>
            {pincodeResult.type && (
              <div className={`pincode-result ${pincodeResult.type}`}>
                {pincodeResult.message}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-label">Testimonials</span>
            <h2 className="section-title">What Farmers Say</h2>
            <p className="section-desc">
              Join thousands of satisfied fish farmers who trust AL Azeem.
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-quote">&ldquo;</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-location">📍 {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 className="cta-title">Ready to Grow Your Fish Farm?</h2>
          <p className="cta-desc">
            Contact us today to get a customized quote or to place your first
            order via WhatsApp.
          </p>
          <div className="cta-actions">
            <Link href="/products" className="btn btn-accent btn-lg">
              View All Products
            </Link>
            <a
              href="https://wa.me/917865055431?text=Hello!%20I%27d%20like%20to%20get%20a%20quote%20for%20fish%20feed."
              className="btn btn-whatsapp btn-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Chat on WhatsApp
            </a>
            <Link href="/dealer" className="btn btn-outline" style={{ color: "white", borderColor: "rgba(255,255,255,0.4)" }}>
              Become a Dealer
            </Link>
          </div>
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
