import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/find/:path*",
    "/journey/:path*",
    "/tickets/:path*",
    "/notifications/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};