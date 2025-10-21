import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/prisma/client";
import { randomAvatar } from "@/utils/randomAvatar";
import bcrypt from "bcryptjs";
import { SessionUser, GoogleProfile, AuthUser } from "@/app/types/user";

// Extend the built-in session and user types
declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
}

// Extend the JWT type to include our custom fields
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

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
            "Please sign in with your social account or reset your password",
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
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
        };
      },
    }),
  ],
  callbacks: {
    // This callback handles user creation for social sign-ins
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email!,
              firstName: (profile as GoogleProfile)?.given_name || "",
              lastName: (profile as GoogleProfile)?.family_name || "",
              phone: "",
              password: "", // No password for social accounts
              image: user.image || randomAvatar() || "",
              emailVerified: true,
              lastLogin: new Date(),
            },
          });
        } else {
          // Update lastLogin for existing user
          await prisma.user.update({
            where: { email: user.email! },
            data: { lastLogin: new Date() },
          });
        }
      } else if (account?.provider === "credentials") {
        // Update lastLogin for credentials sign-in
        await prisma.user.update({
          where: { email: user.email! },
          data: { lastLogin: new Date() },
        });
      }
      return true;
    },

    async jwt({ token, user }) {
      // If `user` object exists, it means the user just signed in.
      if (user) {
        // We add all the data we need from the user object directly to the token.
        token.id = user.id;
        token.role = user.role;
        token.firstName = (user as AuthUser).firstName;
        token.lastName = (user as AuthUser).lastName;
        token.phone = (user as AuthUser).phone;
      }
      return token;
    },

    async session({ session, token }) {
      // NO DATABASE CALL is needed here.
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.phone = token.phone;
        session.user.name =
          `${token.firstName || ""} ${token.lastName || ""}`.trim();
        session.user.needsProfileCompletion = !token.phone;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login", // Custom login page
  },
};
