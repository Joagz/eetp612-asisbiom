import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt_decode, { jwtDecode } from "jwt-decode";

function parseJwt(token: string) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(atob(base64));
}
interface PermissionType {
  url: string;
  roles: string[];
}

const permissions: PermissionType[] = [
  {
    url: "/alumnos/registrar",
    roles: ["DEVELOPER", "DIRECTIVO", "SECRETARIO", "PRECEPTOR"],
  },
  {
    url: "/alumnos",
    roles: ["DEVELOPER", "DIRECTIVO", "SECRETARIO", "PRECEPTOR", "PROFESOR"],
  },
];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_JWT_COOKIE) {
    const jwt: RequestCookie | undefined = cookies().get(
      process.env.NEXT_PUBLIC_JWT_COOKIE
    )!;

    if (jwt) {
      if (request.nextUrl.pathname == "/signin")
        return NextResponse.redirect(new URL("/", request.url));

      const decoded: { roles: string } = parseJwt(jwt.value);

      console.log(request.nextUrl.pathname);
      for (let i = 0; i < permissions.length; i++) {
        if (request.nextUrl.pathname.includes(permissions[i].url))
          if (
            permissions[i].roles.find((role) => role == decoded.roles) != null
          )
            return NextResponse.next();
      }
    }
    if (request.nextUrl.pathname == "/signin") return NextResponse.next();

    return NextResponse.redirect(new URL("/signin", request.url));
  }

  throw new Error();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/alumnos/:path*", "/docentes/:path*", "/form/:path*", "/signin"],
};
