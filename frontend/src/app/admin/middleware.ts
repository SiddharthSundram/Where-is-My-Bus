import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional admin middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return token?.role === "ADMIN";
      },
    },
  }
);