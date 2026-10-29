import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, context: Context) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};
    for (const key of ["name", "sku", "description", "unit"] as const) {
      if (typeof body[key] === "string") data[key] = body[key].trim();
    }
    for (const key of ["sellingPrice", "purchasePrice", "bulkPrice", "stockQuantity", "lowStockAt"] as const) {
      if (body[key] !== undefined) {
        const value = body[key] === null || body[key] === "" ? null : Number(body[key]);
        if (value !== null && (!Number.isFinite(value) || value < 0)) {
          return NextResponse.json({ error: key + " must be a non-negative number." }, { status: 400 });
        }
        data[key] = value;
      }
    }
    for (const key of ["active", "featured"] as const) {
      if (typeof body[key] === "boolean") data[key] = body[key];
    }
    if (body.categoryId !== undefined) data.categoryId = typeof body.categoryId === "string" && body.categoryId ? body.categoryId : null;
    const product = await prisma.product.update({ where: { id }, data: data as never });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Could not update product. Check the product ID and database connection." }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  const { id } = await context.params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete product. Check the product ID and whether it is referenced by an order." }, { status: 400 });
  }
}
