import { Role } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProduction = process.env.NODE_ENV === "production";
  // Extract the token using NextAuth's JWT utility
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: isProduction
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
    secureCookie: isProduction,
  });
  // Protect routes based on session existence and roles
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (token.role !== Role.ADMIN) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  if (pathname.startsWith("/products")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  if (pathname === "/") {
    if (!token) {
      return NextResponse.redirect(new URL("/products", request.url));
    }
  }
  if (pathname === "/login" || pathname === "/signup") {
    if (token?.role === Role.ADMIN) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (token?.role === Role.USER) {
      return NextResponse.redirect(new URL("/products", request.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*"],
};
