import { NextRequest, NextResponse } from "next/server";
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  if (url.searchParams.has("co") || url.searchParams.has("v")) {
    const target = url.clone();
    target.pathname = "/personalized" + url.pathname;
    return NextResponse.rewrite(target);
  }
  return NextResponse.next();
}
export const config = { matcher: "/for/:industry" };
