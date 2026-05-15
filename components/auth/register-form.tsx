"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, LockKeyhole, Mail, ShieldCheck, User, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, FieldLabel } from "@/components/ui/field";

type Role = "consumer" | "producer";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "consumer" as Role,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleRoleChange = (role: Role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("The passwords provided do not match.");
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
        throw new Error(data.message || 'Account setup failed');
      }

      router.push("/auth/login?registered=true");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An account conflict occurred. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <FieldGroup>
        <FieldLabel htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Name
        </FieldLabel>
        <div className="relative">
          <User className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="Jane Apiary"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="h-[52px] rounded-lg border-border/70 bg-background/70 pl-12 text-base"
          />
        </div>
      </FieldGroup>

      <FieldGroup>
        <FieldLabel htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Email address
        </FieldLabel>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="h-[52px] rounded-lg border-border/70 bg-background/70 pl-12 text-base"
          />
        </div>
      </FieldGroup>

      <FieldGroup>
        <FieldLabel className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Account type
        </FieldLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          <RoleButton
            active={formData.role === "consumer"}
            icon={Users}
            title="Consumer"
            text="Scan, order, and review"
            onClick={() => handleRoleChange("consumer")}
          />
          <RoleButton
            active={formData.role === "producer"}
            icon={ShieldCheck}
            title="Producer"
            text="Register and sell batches"
            onClick={() => handleRoleChange("producer")}
          />
        </div>
      </FieldGroup>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGroup>
          <FieldLabel htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Password
          </FieldLabel>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Create password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="h-[52px] rounded-lg border-border/70 bg-background/70 pl-12 text-base"
            />
          </div>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Confirm
          </FieldLabel>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="h-[52px] rounded-lg border-border/70 bg-background/70 pl-12 text-base"
            />
          </div>
        </FieldGroup>
      </div>

      {error && (
        <div className="flex gap-3 rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive motion-rise">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="h-[52px] w-full gap-2">
        {isLoading ? "Creating account..." : "Create account"}
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}

function RoleButton({
  active,
  icon: Icon,
  title,
  text,
  onClick,
}: {
  active: boolean;
  icon: LucideIcon;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-start gap-3 rounded-lg border p-4 text-left transition-all",
        active
          ? "border-primary/40 bg-primary/12 text-foreground shadow-sm"
          : "border-border/70 bg-background/45 text-muted-foreground hover:border-primary/30 hover:bg-muted/50 hover:text-foreground",
      ].join(" ")}
    >
      <span className={["grid size-10 shrink-0 place-items-center rounded-md", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"].join(" ")}>
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="mt-1 block text-sm leading-5 opacity-80">{text}</span>
      </span>
    </button>
  );
}
