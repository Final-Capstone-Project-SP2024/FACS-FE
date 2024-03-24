import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "firecameraalarmsolution",
      credentials: {
        securitycode: { label: "securitycode", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials, req) {
        const res = await fetch(`${process.env.API_URL}/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.securitycode,
            password: credentials?.password,
          }),
          cache: "no-cache",
        });

        const user = await res.json();

        if (res.ok && user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/SignIn",
  },

  callbacks: {
    async jwt({ token, user, profile }) {
      return { ...token, ...user };
    },

    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
};
