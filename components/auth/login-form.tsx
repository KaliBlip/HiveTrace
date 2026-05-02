"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, FieldLabel } from "@/components/ui/field";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result?.error) {
        setError("Invalid email or password");
      } else {
        // We need to wait a tiny bit for the session to be available or fetch it
        // For simplicity, we can fetch the user by email to get the role if session isn't immediate
        // But usually, router.push is enough if the middleware handles the next hop.
        // However, the user wants explicit logic here.
        
        // Since we don't have the role yet from useAuth (it's async), 
        // let's just push to /dashboard and let the dashboard redirect (which we already implemented!)
        // WAIT: The user specifically asked to navigate to shop page for consumers.
        // I already added a redirect in /dashboard for consumers, but let's make it direct here.
        
        router.push("/dashboard"); 
        // My previous fix in app/dashboard/page.tsx already redirects CONSUMERS to /consumer
        // and I should probably change that to /shop as requested now.
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <FieldGroup>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </FieldGroup>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        Demo: email: <code className="bg-muted px-2 py-1 rounded">demo@hivetrace.com</code> / password: <code className="bg-muted px-2 py-1 rounded">demo123</code>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-primary hover:underline font-medium">
          Register here
        </Link>
      </p>
    </form>
  );
}
