import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  {
    url: "/nota",
    roles: ["DEVELOPER", "DIRECTIVO", "SECRETARIO", "PRECEPTOR"],
  },
  {
    url: "/sensor",
    roles: ["DEVELOPER", "DIRECTIVO"],
  },
  {
    url: "/docentes",
    roles: ["DEVELOPER", "DIRECTIVO"],
  },
];

function parseJwt(token: string) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(atob(base64));
}

export async function middleware(request: NextRequest) {
  try {
    if (process.env.NEXT_PUBLIC_JWT_COOKIE) {
      const jwt: RequestCookie | undefined = cookies().get(
        process.env.NEXT_PUBLIC_JWT_COOKIE
      );

      if (jwt) {
        const jwtValue = jwt.value;
        const decoded: { roles: string } = parseJwt(jwtValue);

        // Check if user has permission for the current URL
        const hasPermission = permissions.some((permission) =>
          request.nextUrl.pathname.startsWith(permission.url) &&
          permission.roles.includes(decoded.roles)
        );

        if (!hasPermission) {
          return NextResponse.redirect(
            new URL(
              `/forbidden?forbidden_url=${request.nextUrl.pathname}&rollback=/`,
              request.url
            )
          );
        }

        return NextResponse.next();
      }

      if (request.nextUrl.pathname === "/signin") {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL("/signin", request.url));
    }
  } catch (error) {
    console.error("Error en el middleware:", error);
  }

  throw new Error("Configuración Inválida");
}

export const config = {
  matcher: ["/alumnos/:path*", "/docentes/:path*", "/form/:path*", "/signin", "/nota/:path*", "/sensor/:path*"],
};
