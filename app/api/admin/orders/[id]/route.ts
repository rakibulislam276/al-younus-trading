import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const data: { status?: OrderStatus; paymentStatus?: string } = {};
    if (body.status !== undefined) {
      if (!Object.values(OrderStatus).includes(body.status as OrderStatus)) return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
      data.status = body.status as OrderStatus;
    }
    if (body.paymentStatus !== undefined) {
      const allowed = ["UNPAID", "PENDING", "PAID", "PARTIALLY_PAID", "REFUNDED"];
      if (typeof body.paymentStatus !== "string" || !allowed.includes(body.paymentStatus)) return NextResponse.json({ error: "Invalid payment status." }, { status: 400 });
      data.paymentStatus = body.paymentStatus;
    }
    if (!Object.keys(data).length) return NextResponse.json({ error: "No valid changes supplied." }, { status: 400 });
    const order = await prisma.order.update({ where: { id }, data, include: { customer: true, items: true } });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Could not update order." }, { status: 400 });
  }
}
