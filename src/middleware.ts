import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔥 IMPORTANT: routes that MUST NOT be blocked
  const publicAuthFlow = [
    "/auth",
    "/callback",
  ];

  // ❌ skip middleware entirely for OAuth flow
  if (publicAuthFlow.some((route) => pathname.startsWith(route))) {
    return response;
  }

  // protected routes
  const protectedRoutes = ["/feed", "/create", "/profile"];

  // auth-only routes
  const authRoutes = ["/login", "/register"];

  // 🚨 not logged in → block protected routes
  if (!user && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🚨 logged in → block login/register
  if (user && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/feed/:path*",
    "/create/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/auth/:path*",
  ],
};