'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2 mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">🍯</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold">Join HiveTrace</h1>
        <p className="text-muted-foreground">Create your account to get started</p>
      </div>

      <Card className="border-border">
        <CardContent className="pt-6 flex justify-center">
          <RegisterForm />
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
