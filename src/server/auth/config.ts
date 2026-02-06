import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt-ts";
import { db } from "~/server/db";
import { authConfigBase } from "./config.base";

/**
 * Main Options for NextAuth.js used in the server-side (API routes, etc.).
 * Includes database adapter and full provider logic.
 */
export const authConfig = {
  ...authConfigBase,
  adapter: PrismaAdapter(db),
  providers: [
    ...authConfigBase.providers,
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as any;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          activeWorkspaceId: user.activeWorkspaceId ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfigBase.callbacks,
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub as string,
          activeWorkspaceId: (token as any).activeWorkspaceId as string | undefined,
        },
      };
    },
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.id = user.id;
        token.activeWorkspaceId = (user as any).activeWorkspaceId;
      }

      // Allow manual updates
      if (trigger === "update" && (session as any)?.activeWorkspaceId) {
        token.activeWorkspaceId = (session as any).activeWorkspaceId;
      }

      // IF we have a token sub (user ID), let's try to refresh the workspace ID from DB
      // This handles cases where we updated the DB but didn't explicitly call update() on the client
      if (token.sub) {
        const freshUser = await db.user.findUnique({
          where: { id: token.sub },
          select: { activeWorkspaceId: true },
        });
        if (freshUser) {
          token.activeWorkspaceId = freshUser.activeWorkspaceId;
        }
      }

      return token;
    },
  },
} satisfies NextAuthConfig;
