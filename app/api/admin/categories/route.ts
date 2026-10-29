import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: "asc" } });
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ error: "Database unavailable. Configure DATABASE_URL and apply the Prisma schema." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    if (!name || name.length > 100) return NextResponse.json({ error: "Category name is required (max 100 characters)." }, { status: 400 });
    const base = slugify(name) || "category";
    const category = await prisma.category.create({ data: { name, slug: base + "-" + crypto.randomUUID().slice(0, 6), description: description || null, active: body.active !== false } });
    return NextResponse.json({ category }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create category. Check database connection." }, { status: 400 });
  }
}
