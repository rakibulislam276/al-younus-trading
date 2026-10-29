import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get("alyounus_session")?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret || secret.length < 32) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (pathname.startsWith("/api/admin") && payload.role !== "ADMIN" && payload.role !== "STAFF") {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      const response = NextResponse.json({ error: "Session expired. Please sign in again." }, { status: 401 });
      response.cookies.delete("alyounus_session");
      return response;
    }
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete("alyounus_session");
    return response;
  }
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
