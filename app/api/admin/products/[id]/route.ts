import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAuth() {
    const session = await getServerSession(authOptions);
    if (!session) return null;
    return session;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await checkAuth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { name, description, category_id, protein_percent, size, price, image_url, is_active } = body;

    const product = await prisma.product.update({
        where: { id: Number(id) },
        data: {
            name,
            description,
            category_id: category_id ? Number(category_id) : undefined,
            protein_percent,
            size,
            price: price !== undefined ? Number(price) : undefined,
            image_url,
            is_active,
        },
        include: { category: true },
    });

    return NextResponse.json(product);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await checkAuth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await prisma.product.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
}
