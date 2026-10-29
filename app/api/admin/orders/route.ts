import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({ include: { customer: true, items: true }, orderBy: { createdAt: "desc" }, take: 200 });
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Database unavailable. Configure DATABASE_URL and apply the Prisma schema." }, { status: 503 });
  }
}
