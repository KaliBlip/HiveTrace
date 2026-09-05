"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";

export function useAuth() {
  const { data: session, status, update } = useSession();

  const login = useCallback(
    async (email: string, password: string) => {
      const callbackUrl =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("callbackUrl") || window.location.origin
          : undefined;

      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false,
      });
      return result;
    },
    []
  );

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: "/" });
  }, []);

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    login,
    logout,
    update,
    role: (session?.user as any)?.role || "consumer",
  };
}
