import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const currPath = { path: request.nextUrl.pathname, type: "" };
  const token = request.cookies.get("token")?.value || "";

  const protectedPath = ["/profile"]; // only logged in user
  const guestPath = ["/signup", "/login"]; // only logged out user
  const publicPath = ["/", "/verifyemail"]; // both logged in and logged out

  const isProtectedPath = protectedPath.some((path) => currPath.path == path);
  const isGuestPath = guestPath.some((path) => currPath.path == path);
  const isPublicPath = publicPath.some((path) => currPath.path == path);

  if (isProtectedPath) {
    currPath.type = "protectedPath";
  } else if (isGuestPath) {
    currPath.type = "guestPath";
  } else if (isPublicPath) {
    currPath.type = "publicPath";
  }

  if (currPath.type == "protectedPath" && token) {
    // nothing to do
  }
  if (currPath.type == "protectedPath" && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (currPath.type == "guestPath" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (currPath.type == "guestPath" && !token) {
    // nothing to do
  }

  if (currPath.type == "publicPath" && token) {
    // nothing to do
  }
  if (currPath.type == "publicPath" && !token) {
    // nothing to do
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/login", "/signup", "/profile"],
};
