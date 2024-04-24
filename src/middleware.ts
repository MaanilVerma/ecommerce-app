import { deleteCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";
import { TOKEN } from "./libs/enums/constants";

const protectedRoutes = ["/dashboard"];

export default async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const token = req.cookies.get(`${TOKEN}`);

  if (!token) {
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(`${origin}/login`);
    }

    return NextResponse.next();
  }

  try {
    let decodedToken = null;
    if (token?.value) {
      const base64Url = token.value.split(".")[1];
      if (base64Url) {
        decodedToken = JSON.parse(atob(base64Url));
      }
    }

    if (!decodedToken) {
      deleteCookie("TOKEN");
      return NextResponse.redirect(`${origin}/login`);
    }

    const { exp } = decodedToken as { exp: number };
    const isExpired = exp * 1000 < Date.now();

    if (isExpired) {
      deleteCookie("TOKEN");
      return NextResponse.redirect(`${origin}/login`);
    }

    if (!isExpired && pathname === "/login") {
      return NextResponse.redirect(`${origin}/dashboard`);
    }

    return NextResponse.next();
  } catch (err) {
    if (pathname === "/login") {
      deleteCookie("TOKEN");
      return NextResponse.next();
    }
    return NextResponse.redirect(`${origin}/login`);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
