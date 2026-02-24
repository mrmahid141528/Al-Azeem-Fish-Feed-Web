import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, phone, business, city, details } = body;

        if (!name || !phone || !details) {
            return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
        }

        const application = await prisma.dealerApplication.create({
            data: {
                name,
                phone,
                business: business || "",
                city: city || "",
                details,
                status: "PENDING",
            },
        });

        return NextResponse.json({ success: true, id: application.id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to save application" }, { status: 500 });
    }
}
