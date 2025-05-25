import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if user is authenticated for protected routes
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth")
  const isAuthCallback = request.nextUrl.pathname === "/auth/callback"
  const isPublicRoute = isAuthPage || isAuthCallback

  // Get token from cookies or headers
  const token =
    request.cookies.get("sbhs_session_id")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

  // If accessing auth page and already authenticated, redirect to home
  if (isAuthPage && !isAuthCallback && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Allow auth callback to proceed without authentication
  if (isAuthCallback) {
    return NextResponse.next()
  }

  // If accessing protected route without token, redirect to auth
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
