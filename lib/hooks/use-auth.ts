"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";

export function useAuth() {
  const { data: session, status } = useSession();

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      return result;
    },
    []
  );

  const logout = useCallback(async () => {
    await signOut({ redirect: true, redirectUrl: "/" });
  }, []);

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    login,
    logout,
    role: (session?.user as any)?.role || "consumer",
  };
}
