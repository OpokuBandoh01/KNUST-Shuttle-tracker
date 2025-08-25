import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // For development purposes, we're allowing all admin access
  // In production, this would check for proper authentication

  const { pathname } = request.nextUrl

  // Allow all admin routes during development
  if (pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
