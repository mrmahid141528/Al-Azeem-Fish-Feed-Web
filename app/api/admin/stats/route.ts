import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [products, orders, pincodes, dealers, pendingOrders] = await Promise.all([
        prisma.product.count(),
        prisma.orderInquiry.count(),
        prisma.pincode.count({ where: { is_active: true } }),
        prisma.dealerApplication.count(),
        prisma.orderInquiry.count({ where: { status: "PENDING" } }),
    ]);

    return NextResponse.json({ products, orders, pincodes, dealers, pendingOrders });
}
