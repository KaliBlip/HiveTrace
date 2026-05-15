"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, FieldLabel } from "@/components/ui/field";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "consumer", // or "producer"
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("The security keys provided do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role.toUpperCase(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Identity establishment failed');
      }

      router.push("/auth/login?registered=true");
    } catch (err: any) {
      setError(err.message || "An identity conflict occurred. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FieldGroup className="md:col-span-2">
          <FieldLabel htmlFor="name" className="text-stone-400 font-semibold text-[10px] uppercase tracking-[0.2em] ml-1 mb-2">
            Full Legal Name / Alias
          </FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Julian Artisan"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="h-16 rounded-2xl bg-stone-950/50 border-white/5 focus:border-primary/40 focus:ring-primary/10 text-white placeholder:text-stone-700 transition-all px-6 text-base"
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel htmlFor="email" className="text-stone-400 font-semibold text-[10px] uppercase tracking-[0.2em] ml-1 mb-2">
            Digital Address
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="artisan@hivetrace.net"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="h-16 rounded-2xl bg-stone-950/50 border-white/5 focus:border-primary/40 focus:ring-primary/10 text-white placeholder:text-stone-700 transition-all px-6 text-base"
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel htmlFor="role" className="text-stone-400 font-semibold text-[10px] uppercase tracking-[0.2em] ml-1 mb-2">
            Network Role
          </FieldLabel>
          <div className="relative">
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="h-16 w-full rounded-2xl border border-white/5 bg-stone-950/50 px-6 text-white focus:border-primary/40 focus:ring-primary/10 transition-all outline-none appearance-none text-base"
            >
              <option value="consumer" className="bg-stone-950">Consumer (Verification)</option>
              <option value="producer" className="bg-stone-950">Producer (Stewardship)</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel htmlFor="password" className="text-stone-400 font-semibold text-[10px] uppercase tracking-[0.2em] ml-1 mb-2">
            Security Key
          </FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="h-16 rounded-2xl bg-stone-950/50 border-white/5 focus:border-primary/40 focus:ring-primary/10 text-white placeholder:text-stone-700 transition-all px-6 text-base"
          />
        </FieldGroup>

        <FieldGroup>
          <FieldLabel htmlFor="confirmPassword" className="text-stone-400 font-semibold text-[10px] uppercase tracking-[0.2em] ml-1 mb-2">
            Confirm Key
          </FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
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

      <Button 
        type="submit" 
        className="w-full h-16 rounded-2xl font-bold text-base uppercase tracking-[0.15em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 bg-primary text-stone-950" 
        disabled={isLoading}
      >
        {isLoading ? "Establishment..." : "Establish Identity"}
      </Button>

      <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-stone-600">
        Already Registered?{" "}
        <Link href="/auth/login" className="text-primary hover:text-white transition-all duration-300 ml-2">
          Initialize Session
        </Link>
      </p>
    </form>
  );
}
