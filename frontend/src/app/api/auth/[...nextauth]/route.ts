// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/auth";

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("http://localhost:5000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        if (!res.ok) {
          const error = await res.json().catch(() => null);
          throw new Error(error?.error || "Login failed");
        }

        const data = await res.json().catch(() => null);

        if (data?.token) {
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            token: data.token,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
      };
      session.token = token.token;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// ✅ IMPORTANT: Named exports instead of default
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
