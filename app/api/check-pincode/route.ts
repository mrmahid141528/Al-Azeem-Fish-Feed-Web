import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.json({ available: false });
    }

    try {
        const pincode = await prisma.pincode.findUnique({
            where: { code: code },
        });

        if (pincode && pincode.is_active) {
            return NextResponse.json({ available: true, area: pincode.area });
        }
        return NextResponse.json({ available: false });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ available: false });
    }
}
