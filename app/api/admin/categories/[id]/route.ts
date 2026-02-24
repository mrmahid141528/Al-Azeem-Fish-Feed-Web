import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAuth() {
    const session = await getServerSession(authOptions);
    if (!session) return null;
    return session;
}

// PUT update category
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await checkAuth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { name, image_url, display_order } = await request.json();

    if (!name?.trim()) {
        return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const category = await prisma.category.update({
        where: { id: Number(id) },
        data: {
            name: name.trim(),
            image_url: image_url || null,
            display_order: Number(display_order) || 0,
        },
        include: { _count: { select: { products: true } } },
    });
    return NextResponse.json(category);
}

// DELETE category (only if no products linked)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await checkAuth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Check if any products use this category
    const productCount = await prisma.product.count({
        where: { category_id: Number(id) },
    });

    if (productCount > 0) {
        return NextResponse.json(
            {
                error: `Cannot delete: ${productCount} product(s) are linked to this category. Reassign or delete those products first.`,
            },
            { status: 400 }
        );
    }

    await prisma.category.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
}
