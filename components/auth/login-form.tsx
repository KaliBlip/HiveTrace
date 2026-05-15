"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowRight, LockKeyhole, Mail, Sparkles } from "lucide-react";
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result?.error) {
        setError("The credentials provided do not match our records.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("A network synchronization error occurred. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <FieldGroup>
        <FieldLabel htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Email address
        </FieldLabel>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="producer@hivetrace.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={isLoading}
            className="h-[52px] rounded-lg border-border/70 bg-background/70 pl-12 text-base"
          />
        </div>
      </FieldGroup>

      <FieldGroup>
        <div className="flex items-center justify-between gap-3">
          <FieldLabel htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Password
          </FieldLabel>
          <Link href="#" className="text-xs font-semibold text-primary hover:underline">
            Reset password
          </Link>
        </div>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={isLoading}
            className="h-[52px] rounded-lg border-border/70 bg-background/70 pl-12 text-base"
          />
        </div>
      </FieldGroup>

      {error && (
        <div className="flex gap-3 rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive motion-rise">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="h-[52px] w-full gap-2">
        {isLoading ? "Signing in..." : "Sign in"}
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
