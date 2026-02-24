import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await prisma.orderInquiry.findMany({
        include: { product: { include: { category: true } } },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
}
