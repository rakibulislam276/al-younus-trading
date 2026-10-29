import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password || password.length > 200) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const secret = process.env.AUTH_SECRET;
    if (!secret || secret.length < 32) {
      return NextResponse.json({ error: "Server authentication is not configured." }, { status: 503 });
    }
    const token = await new SignJWT({ role: user.role, email: user.email, name: user.name })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(user.id)
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(new TextEncoder().encode(secret));
    const response = NextResponse.json({ ok: true, redirect: "/admin" });
    response.cookies.set("alyounus_session", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", path: "/", maxAge: 60 * 60 * 8
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Database is unavailable or the request is invalid." }, { status: 503 });
  }
}
