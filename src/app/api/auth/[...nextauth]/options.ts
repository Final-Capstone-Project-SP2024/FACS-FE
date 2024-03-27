import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "firealarmcamerasolution",
      credentials: {
        securityCode: { label: "securityCode", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials) : Promise<any> {
        try {
          const res = await fetch(`${process.env.API_URL}/User/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              securityCode: credentials?.securityCode,
              password: credentials?.password,
            }),
            cache: "no-cache",
          });
  
          const user = await res.json();
          // console.log(user);

          if (res.ok && user) {
            return user;
          } else {
            return null;
          }
        } catch (err) {
          console.log(err);
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
      // console.log(token);
      return session;
    },
  },
};
