import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userId: number;
      name: string;
      email: string;
      role: {
        roleName: string;
      };
      accessToken: string;
      refreshToken: string;
    } & DefaultSession["user"];
  }
}
