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
    session: ({ session, user, token }) => {
      // Extended session callback for database-backed sessions if needed
      const baseSession = authConfigBase.callbacks.session({ session, token } as any);
      
      const userId = user?.id ?? token?.sub;
      const activeWorkspaceId = (user as any)?.activeWorkspaceId ?? (token as any)?.activeWorkspaceId;

      return {
        ...baseSession,
        user: {
          ...baseSession.user,
          id: userId,
          activeWorkspaceId,
        },
      };
    },
  },
} satisfies NextAuthConfig;
