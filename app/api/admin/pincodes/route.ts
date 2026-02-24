import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const pincodes = await prisma.pincode.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(pincodes);
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { code, area, is_active } = await request.json();
    if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

    const pincode = await prisma.pincode.create({
        data: { code, area: area || "", is_active: is_active !== false },
    });
    return NextResponse.json(pincode, { status: 201 });
}
