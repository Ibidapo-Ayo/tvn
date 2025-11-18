import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the auth token from cookies
  const authToken = request.cookies.get("authToken")?.value;
  
  // Define protected routes (routes that require authentication)
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Define public routes (routes that should redirect to dashboard if authenticated)
  const publicRoutes = ["/", "/login"];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // If user is trying to access a protected route without a token
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // If user is trying to access login/home page with a valid token
  if (isPublicRoute && authToken) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  return NextResponse.next();
}

// Configure which routes the middleware should run on
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
};

