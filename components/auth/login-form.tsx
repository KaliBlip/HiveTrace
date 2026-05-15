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
        setError("The credentials provided do not match our records.");
      } else {
        router.push("/dashboard"); 
      }
    } catch (err) {
      setError("A network synchronization error occurred. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 w-full">
      <div className="space-y-8">
        <FieldGroup>
          <FieldLabel htmlFor="email" className="text-stone-400 font-semibold text-[10px] uppercase tracking-[0.2em] ml-1 mb-2">
            Identity / Email
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="artisan@hivetrace.net"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="h-16 rounded-2xl bg-stone-950/50 border-white/5 focus:border-primary/40 focus:ring-primary/10 text-white placeholder:text-stone-700 transition-all px-6 text-base"
          />
        </FieldGroup>

        <FieldGroup>
          <div className="flex items-center justify-between ml-1 mb-2">
            <FieldLabel htmlFor="password" className="text-stone-400 font-semibold text-[10px] uppercase tracking-[0.2em]">
              Security Key
            </FieldLabel>
            <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors">
              Reset Key
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="h-16 rounded-2xl bg-stone-950/50 border-white/5 focus:border-primary/40 focus:ring-primary/10 text-white placeholder:text-stone-700 transition-all px-6 text-base"
          />
        </FieldGroup>
      </div>

      {error && (
        <div className="bg-red-500/5 border border-red-500/10 text-red-400/80 px-6 py-4 rounded-2xl text-xs font-medium tracking-tight animate-in fade-in slide-in-from-top-2 duration-300">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <Button 
          type="submit" 
          className="w-full h-16 rounded-2xl font-bold text-base uppercase tracking-[0.15em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 bg-primary text-stone-950" 
          disabled={isLoading}
        >
          {isLoading ? "Synchronizing..." : "Initialize Session"}
        </Button>

        <div className="p-6 rounded-3xl bg-stone-950/40 border border-white/5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Sandbox Credentials</span>
          </div>
          <div className="flex items-center justify-between">
            <code className="text-xs text-stone-500 font-mono">demo@hivetrace.com</code>
            <code className="text-xs text-primary/60 font-mono italic">demo123</code>
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-stone-600">
        New Participant?{" "}
        <Link href="/auth/register" className="text-primary hover:text-white transition-all duration-300 ml-2">
          Create Identity
        </Link>
      </p>
    </form>
  );
}
