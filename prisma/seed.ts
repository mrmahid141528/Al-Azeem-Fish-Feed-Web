import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting database seed...");

    // Create admin user
    const passwordHash = await bcrypt.hash("admin@123", 10);
    const admin = await prisma.adminUser.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            password_hash: passwordHash,
        },
    });
    console.log("✅ Admin user created:", admin.username);

    // Delete existing products/categories to avoid duplicates
    await prisma.orderInquiry.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    // Create categories
    const [catFloat, catSink, catShrimp, catSpecial] = await Promise.all([
        prisma.category.create({ data: { name: "Floating Fish Feed", display_order: 1 } }),
        prisma.category.create({ data: { name: "Sinking Fish Feed", display_order: 2 } }),
        prisma.category.create({ data: { name: "Shrimp Feed", display_order: 3 } }),
        prisma.category.create({ data: { name: "Specialty Feed", display_order: 4 } }),
    ]);
    console.log("✅ Categories created: 4");

    // Create products
    const products = [
        {
            name: "Premium Floating Fish Feed - 28% Protein",
            description: "High-quality floating pellets with 28% protein content, perfect for grow-out stage of Rohu, Catla, and Common Carp.",
            category_id: catFloat.id,
            protein_percent: "28%",
            size: "2-3mm",
            price: 42,
            is_active: true,
        },
        {
            name: "Super Floating Fish Feed - 32% Protein",
            description: "Premium floating pellets with 32% protein for faster growth rates in freshwater fish farming.",
            category_id: catFloat.id,
            protein_percent: "32%",
            size: "3-4mm",
            price: 52,
            is_active: true,
        },
        {
            name: "Starter Floating Feed - 40% Protein",
            description: "Micro pellets for fingerlings and fry. High protein content supports rapid early-stage growth.",
            category_id: catFloat.id,
            protein_percent: "40%",
            size: "0.5-1mm",
            price: 78,
            is_active: true,
        },
        {
            name: "Sinking Fish Feed - 28% Protein",
            description: "Economy sinking pellets ideal for bottom-feeding fish like Catfish and Mrigal.",
            category_id: catSink.id,
            protein_percent: "28%",
            size: "3-4mm",
            price: 38,
            is_active: true,
        },
        {
            name: "High Protein Sinking Feed - 35% Protein",
            description: "Premium sinking feed with enhanced protein for intensive aquaculture operations.",
            category_id: catSink.id,
            protein_percent: "35%",
            size: "4-5mm",
            price: 55,
            is_active: true,
        },
        {
            name: "Premium Shrimp Feed - 38% Protein",
            description: "Specially formulated micro-pellets for Vannamei and Tiger shrimp with optimal nutrient balance.",
            category_id: catShrimp.id,
            protein_percent: "38%",
            size: "0.5-2mm",
            price: 95,
            is_active: true,
        },
        {
            name: "Shrimp Starter Feed - 42% Protein",
            description: "High protein crumble for post-larval and juvenile shrimp stages.",
            category_id: catShrimp.id,
            protein_percent: "42%",
            size: "0.3-0.5mm",
            price: 120,
            is_active: true,
        },
        {
            name: "Tilapia Growth Feed - 30% Protein",
            description: "Balanced nutrition pellets optimized specifically for Tilapia farming.",
            category_id: catSpecial.id,
            protein_percent: "30%",
            size: "2-4mm",
            price: 45,
            is_active: true,
        },
    ];

    await prisma.product.createMany({ data: products });
    console.log("✅ Products created:", products.length);

    // Create sample pincodes
    await prisma.pincode.deleteMany();
    const pincodes = [
        { code: "141001", area: "Ludhiana, Punjab", is_active: true },
        { code: "141002", area: "Ludhiana East, Punjab", is_active: true },
        { code: "141003", area: "Ludhiana West, Punjab", is_active: true },
        { code: "143001", area: "Amritsar, Punjab", is_active: true },
        { code: "143002", area: "Amritsar South, Punjab", is_active: true },
        { code: "160001", area: "Chandigarh", is_active: true },
        { code: "160002", area: "Chandigarh Sector 2", is_active: true },
        { code: "110001", area: "Delhi - Connaught Place", is_active: true },
        { code: "110002", area: "Delhi - Darya Ganj", is_active: true },
        { code: "122001", area: "Gurgaon, Haryana", is_active: true },
        { code: "201001", area: "Ghaziabad, UP", is_active: true },
        { code: "201301", area: "Noida, UP", is_active: true },
    ];
    await prisma.pincode.createMany({ data: pincodes });
    console.log("✅ Pincodes created:", pincodes.length);

    console.log("\n🎉 Database seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔐 Admin Login Credentials:");
    console.log("   Username: admin");
    console.log("   Password: admin@123");
    console.log("   URL:      http://localhost:3000/admin");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
