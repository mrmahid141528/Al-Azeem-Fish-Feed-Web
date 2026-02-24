import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAuth() {
    const session = await getServerSession(authOptions);
    if (!session) return null;
    return session;
}

// GET all categories (with product count)
export async function GET() {
    const session = await checkAuth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const categories = await prisma.category.findMany({
        orderBy: { display_order: "asc" },
        include: { _count: { select: { products: true } } },
    });
    return NextResponse.json(categories);
}

// POST create category
export async function POST(request: NextRequest) {
    const session = await checkAuth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, image_url, display_order } = await request.json();
    if (!name?.trim()) {
        return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const category = await prisma.category.create({
        data: {
            name: name.trim(),
            image_url: image_url || null,
            display_order: Number(display_order) || 0,
        },
        include: { _count: { select: { products: true } } },
    });
    return NextResponse.json(category, { status: 201 });
}
