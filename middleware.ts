import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/kl"];
const authRoutes = ["/auth/signin", "/auth/signup"];

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("currentUser")?.value;

  if ( protectedRoutes.some((route) =>  request.nextUrl.pathname.startsWith(route) ) && !currentUser)
  {
    const response = NextResponse.redirect(
      new URL("/auth/signin", request.url)
    );
    response.cookies.delete("currentUser");
    return response;
  }

  if (
    authRoutes.includes(request.nextUrl.pathname) && 
    currentUser
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}