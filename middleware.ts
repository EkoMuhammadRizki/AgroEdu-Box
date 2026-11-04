import { NextResponse, type NextRequest } from "next/server";
import { GURU_COOKIE, isValidGuruSession } from "@/lib/guru-session";

export async function middleware(request: NextRequest) {
  const loggedIn = await isValidGuruSession(request.cookies.get(GURU_COOKIE)?.value);
  const onLoginPage = request.nextUrl.pathname === "/guru/login";

  if (!loggedIn && !onLoginPage) {
    return NextResponse.redirect(new URL("/guru/login", request.url));
  }
  if (loggedIn && onLoginPage) {
    return NextResponse.redirect(new URL("/guru/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/guru", "/guru/:path*"],
};
