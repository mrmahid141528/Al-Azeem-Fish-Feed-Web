import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { customer_name, phone, product_name, quantity, district, state, pincode, address, notes } = body;

        if (!customer_name || !phone || !district || !state || !pincode || !address) {
            return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
        }

        // Try to find a product match, or use a default
        let product = await prisma.product.findFirst({
            where: { name: { contains: product_name || "" } },
        });

        if (!product) {
            product = await prisma.product.findFirst();
        }

        if (!product) {
            return NextResponse.json({ error: "No products found in database" }, { status: 400 });
        }

        const inquiry = await prisma.orderInquiry.create({
            data: {
                customer_name,
                phone,
                product_id: product.id,
                quantity: quantity || "Not specified",
                district,
                state,
                pincode,
                address,
                notes: notes || "",
                status: "PENDING",
            },
        });

        return NextResponse.json({ success: true, id: inquiry.id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 });
    }
}
