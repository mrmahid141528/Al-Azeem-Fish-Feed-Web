import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { display_order: "asc" },
            select: {
                id: true,
                name: true,
                image_url: true,
                display_order: true,
            },
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}
