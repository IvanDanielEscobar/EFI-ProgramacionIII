import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Proteger todas las rutas bajo /dashboard
  if (pathname.startsWith("/dashboard")) {
    const authToken = request.cookies.get("auth_token")?.value;
    const userRole = request.cookies.get("user_role")?.value;

    // Si no hay sesión iniciada, redirigir inmediatamente a /login
    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Si el usuario está logueado pero es CLIENTE redirigir
    if (userRole === "CLIENTE") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "unauthorized_role");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};