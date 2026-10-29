import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { updatedAt: "desc" }
    });
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Database unavailable. Configure DATABASE_URL and apply the Prisma schema." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const sku = typeof body.sku === "string" ? body.sku.trim().toUpperCase() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const unit = typeof body.unit === "string" && body.unit.trim() ? body.unit.trim() : "piece";
    const sellingPrice = Number(body.sellingPrice);
    const purchasePrice = body.purchasePrice === undefined ? 0 : Number(body.purchasePrice);
    const stockQuantity = body.stockQuantity === undefined ? 0 : Number(body.stockQuantity);
    const lowStockAt = body.lowStockAt === undefined ? 5 : Number(body.lowStockAt);
    if (!name || name.length > 160 || !sku || sku.length > 80 || !description) {
      return NextResponse.json({ error: "Name, SKU and description are required." }, { status: 400 });
    }
    if (!Number.isFinite(sellingPrice) || sellingPrice < 0 || !Number.isFinite(purchasePrice) || purchasePrice < 0 ||
        !Number.isInteger(stockQuantity) || stockQuantity < 0 || !Number.isInteger(lowStockAt) || lowStockAt < 0) {
      return NextResponse.json({ error: "Prices and stock values must be valid non-negative numbers." }, { status: 400 });
    }
    const slugBase = slugify(name) || "product";
    const product = await prisma.product.create({
      data: {
        name, sku, description, slug: slugBase + "-" + crypto.randomUUID().slice(0, 8),
        sellingPrice, purchasePrice, stockQuantity, lowStockAt, unit,
        active: body.active !== false, featured: body.featured === true,
        categoryId: typeof body.categoryId === "string" && body.categoryId ? body.categoryId : null,
        bulkPrice: body.bulkPrice === undefined || body.bulkPrice === null || body.bulkPrice === "" ? null : Number(body.bulkPrice)
      }
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error && error.message.includes("Unique constraint")
      ? "That SKU is already in use."
      : "Could not create product. Check the database connection and category.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
