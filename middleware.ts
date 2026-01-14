import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const isProtected = req.nextUrl.pathname.startsWith("/app");
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("theark_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/", req.url));

  try {
    await verifySession(token);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/app/:path*"],
};
