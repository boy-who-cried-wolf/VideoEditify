import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // If the user is authenticated and tries to access auth pages, redirect to dashboard
    if (req.nextUrl.pathname.startsWith('/auth/') && req.nextauth.token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public access to auth pages
        if (req.nextUrl.pathname.startsWith('/auth/')) {
          return true
        }
        // Require authentication for dashboard and other protected routes
        return !!token
      },
    },
  }
)

// Specify which routes should be protected
export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
} 