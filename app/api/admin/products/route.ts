import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAuth() {
    const session = await getServerSession(authOptions);
    if (!session) return null;
    return session;
}

export async function GET() {
    const session = await checkAuth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
    const session = await checkAuth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, description, category_id, protein_percent, size, price, image_url, is_active } = body;

    if (!name || !category_id) {
        return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }

    const product = await prisma.product.create({
        data: {
            name,
            description,
            category_id: Number(category_id),
            protein_percent,
            size,
            price: price ? Number(price) : null,
            image_url,
            is_active: is_active !== false,
        },
        include: { category: true },
    });

    return NextResponse.json(product, { status: 201 });
}
