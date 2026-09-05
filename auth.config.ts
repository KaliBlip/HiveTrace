import type { NextAuthConfig } from "next-auth";

const isHttps =
  process.env.AUTH_URL?.startsWith("https://") ||
  process.env.NEXTAUTH_URL?.startsWith("https://") ||
  process.env.VERCEL === "1";

export const authConfig = {
  trustHost: true,
  useSecureCookies: isHttps,
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return url;
      // Allows callback URLs on the same origin / host
      try {
        const urlObj = new URL(url);
        const baseUrlObj = new URL(baseUrl);
        if (urlObj.host === baseUrlObj.host) return url;
        // Also allow local network hosts and private IP addresses
        if (
          urlObj.hostname === "localhost" ||
          urlObj.hostname === "127.0.0.1" ||
          urlObj.hostname.startsWith("192.168.") ||
          urlObj.hostname.startsWith("10.") ||
          urlObj.hostname.startsWith("172.") ||
          urlObj.hostname.endsWith(".local")
        ) {
          return url;
        }
      } catch {}
      return url.startsWith("http") ? url : baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "CONSUMER";
        token.image = (user as any).image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).image = token.image as string;
      }
      return session;
    },
  },
  providers: [], 
} satisfies NextAuthConfig;
