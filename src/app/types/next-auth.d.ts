import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      data: {
        Id: string;
        securityCode: string;
        name: string;
        phone: string;
        role: {
          roleName: string;
        };
        accessToken: string;
        refreshToken: string;
      }
    } & DefaultSession["user"];
  }
}
