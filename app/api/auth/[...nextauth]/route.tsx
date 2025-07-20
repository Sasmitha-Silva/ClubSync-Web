import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/client";
import { randomAvatar } from "@/utils/randomAvatar";
import bcrypt from "bcryptjs";
import {
  SessionUser,
  GoogleProfile,
  UserDbResult,
  AuthUser,
} from "@/app/types/user";

// Extend the built-in session type
declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
  interface Profile extends GoogleProfile {}
  interface User extends AuthUser {}
}

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.password) {
            throw new Error(
              "Please sign in with Google or reset your password",
            );
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              firstName: profile?.given_name || "",
              lastName: profile?.family_name || "",
              phone: "",
              password: "",
              image: user.image || randomAvatar() || "",
              emailVerified: true,
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Add user id to token on sign in
      if (user && user.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Existing logic
      if (session.user?.email) {
        const user = (await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            phone: true,
            role: true,
          },
        })) as UserDbResult | null;

        if (user) {
          session.user = {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            image: user.image,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            needsProfileCompletion: !user.phone,
          };
        }
      }
      // Also add id from token if present (for direct access)
      if (session.user && token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
export const authOptions = handler.options;