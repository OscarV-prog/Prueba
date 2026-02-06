import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      activeWorkspaceId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    activeWorkspaceId?: string;
  }
}

/**
 * Shared options for NextAuth.js used in the Edge Runtime (middleware).
 * DO NOT add database adapters or server-only logic here.
 */
export const authConfigBase = {
  providers: [
    ...(process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET
      ? [DiscordProvider({
        clientId: process.env.AUTH_DISCORD_ID,
        clientSecret: process.env.AUTH_DISCORD_SECRET,
      })]
      : []),
  ],
  callbacks: {
    session: ({ session, token }) => {
      const userId = token?.sub;
      const activeWorkspaceId = (token as any)?.activeWorkspaceId;

      return {
        ...session,
        user: {
          ...session.user,
          id: userId,
          activeWorkspaceId,
        },
      };
    },
    jwt: ({ token, user, trigger, session }) => {
      if (user) {
        token.activeWorkspaceId = (user as any).activeWorkspaceId;
      }
      if (trigger === "update" && (session as any)?.activeWorkspaceId) {
        token.activeWorkspaceId = (session as any).activeWorkspaceId;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
} satisfies NextAuthConfig;
