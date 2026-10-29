import { NextRequest, NextResponse } from "next/server";
import { LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({ include: { customer: true }, orderBy: [{ followUpAt: "asc" }, { createdAt: "desc" }] });
    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ error: "Database unavailable. Configure DATABASE_URL and apply the Prisma schema." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const source = typeof body.source === "string" && body.source.trim() ? body.source.trim().slice(0, 60) : "WHATSAPP";
    const status = typeof body.status === "string" && Object.values(LeadStatus).includes(body.status as LeadStatus) ? body.status as LeadStatus : LeadStatus.NEW;
    const followUpAt = body.followUpAt ? new Date(body.followUpAt) : null;
    if (!subject || subject.length > 180) return NextResponse.json({ error: "Lead subject is required (max 180 characters)." }, { status: 400 });
    if (followUpAt && Number.isNaN(followUpAt.getTime())) return NextResponse.json({ error: "Invalid follow-up date." }, { status: 400 });
    let customerId: string | undefined;
    if (body.customer && typeof body.customer.name === "string" && body.customer.name.trim()) {
      const customer = await prisma.customer.create({ data: {
        name: body.customer.name.trim(),
        email: typeof body.customer.email === "string" && body.customer.email.trim() ? body.customer.email.trim() : null,
        phone: typeof body.customer.phone === "string" && body.customer.phone.trim() ? body.customer.phone.trim() : null,
        company: typeof body.customer.company === "string" && body.customer.company.trim() ? body.customer.company.trim() : null
      }});
      customerId = customer.id;
    }
    const lead = await prisma.lead.create({ data: { subject, message: message || null, source, status, followUpAt, customerId }, include: { customer: true } });
    return NextResponse.json({ lead }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not create lead. Check database connection and submitted details." }, { status: 400 });
  }
}
