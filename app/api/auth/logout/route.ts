import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const url = new URL("/app", request.url);
  const response = NextResponse.redirect(url, { status: 303 });
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}

// Handle GET too (in case browser follows redirect as GET)
export async function GET(request: NextRequest) {
  const url = new URL("/app", request.url);
  const response = NextResponse.redirect(url, { status: 303 });
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}