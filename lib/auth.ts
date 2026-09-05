import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";

const isHttps =
  process.env.AUTH_URL?.startsWith("https://") ||
  process.env.NEXTAUTH_URL?.startsWith("https://") ||
  process.env.VERCEL === "1";

export const { 
  handlers, 
  auth, 
  signIn, 
  signOut 
} = NextAuth({
  ...authConfig,
  trustHost: true,
  useSecureCookies: isHttps,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          phoneNumber: user.phoneNumber,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
});
