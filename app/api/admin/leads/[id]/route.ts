import { NextRequest, NextResponse } from "next/server";
import { LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  const { id } = await context.params;
  try {
    const body = await request.json();
    const data: { status?: LeadStatus; followUpAt?: Date | null; message?: string | null } = {};
    if (body.status !== undefined) {
      if (!Object.values(LeadStatus).includes(body.status as LeadStatus)) return NextResponse.json({ error: "Invalid lead status." }, { status: 400 });
      data.status = body.status as LeadStatus;
    }
    if (body.followUpAt !== undefined) {
      const date = body.followUpAt ? new Date(body.followUpAt) : null;
      if (date && Number.isNaN(date.getTime())) return NextResponse.json({ error: "Invalid follow-up date." }, { status: 400 });
      data.followUpAt = date;
    }
    if (body.message !== undefined) data.message = typeof body.message === "string" ? body.message.trim().slice(0, 5000) || null : null;
    if (!Object.keys(data).length) return NextResponse.json({ error: "No valid changes supplied." }, { status: 400 });
    const lead = await prisma.lead.update({ where: { id }, data, include: { customer: true } });
    return NextResponse.json({ lead });
  } catch {
    return NextResponse.json({ error: "Could not update lead." }, { status: 400 });
  }
}
