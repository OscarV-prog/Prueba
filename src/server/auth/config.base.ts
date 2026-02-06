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
      console.log("[Session Callback]", { activeWorkspaceId: (token as any).activeWorkspaceId });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          activeWorkspaceId: (token as any).activeWorkspaceId ?? null,
        },
      };
    },
    jwt: ({ token, user, trigger, session }) => {
      console.log("[JWT Callback]", { trigger, tokenWS: token.activeWorkspaceId, userWS: (user as any)?.activeWorkspaceId });
      if (user) {
        token.id = user.id;
        token.activeWorkspaceId = (user as any).activeWorkspaceId ?? null;
      }
      if (trigger === "update" && (session as any)?.activeWorkspaceId) {
        token.activeWorkspaceId = (session as any).activeWorkspaceId;
        console.log("[JWT Update] New workspace:", token.activeWorkspaceId);
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
