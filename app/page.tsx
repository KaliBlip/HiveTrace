'use client';

import Link from 'next/link';
import { ArrowRight, Check, Zap, Lock, BarChart3, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🍯</span>
            </div>
            <span className="font-bold text-xl text-foreground">HiveTrace</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#security" className="text-muted-foreground hover:text-foreground transition">
              Security
            </Link>
            <Link href="/shop" className="text-muted-foreground hover:text-foreground transition">
              Shop
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition">
              Pricing
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-pretty">
                  Track Honey from Hive to Table
                </h1>
                <p className="text-xl text-muted-foreground max-w-xl">
                  Cryptographically verified traceability. Every batch of honey comes with a unique digital identity that consumers can scan to verify authenticity and producer reputation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    For Producers
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/consumer">
                  <Button size="lg" variant="outline">
                    For Consumers
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-8 border-t border-border">
                <div>
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-muted-foreground">Batches Verified</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-muted-foreground">Producers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-muted-foreground">Cryptographic Security</div>
                </div>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative h-96 lg:h-full min-h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl overflow-hidden">
                <img
                  src="/hero-beehive.jpg"
                  alt="Beehive honeycomb pattern"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">How HiveTrace Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete system for honey producers and consumers to ensure authenticity at every step.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="space-y-4 p-6 rounded-lg border border-border hover:border-primary/50 transition">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Cryptographic Verification</h3>
              <p className="text-muted-foreground">
                Each honey batch gets a unique HMAC-SHA256 signature. Consumers scan the QR code to instantly verify authenticity.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-4 p-6 rounded-lg border border-border hover:border-primary/50 transition">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Producer Reputation</h3>
              <p className="text-muted-foreground">
                Verified reviews and ratings build trust. Producers with consistent quality earn reputation badges.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4 p-6 rounded-lg border border-border hover:border-primary/50 transition">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Instant QR Scanning</h3>
              <p className="text-muted-foreground">
                No app needed. Consumers simply scan the QR code on the honey jar with their phone camera.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Built for Trust</h2>
              <div className="space-y-4">
                {[
                  'Anti-fraud detection with geo-verification',
                  'Duplicate QR code prevention',
                  'Admin dashboard for fraud monitoring',
                  'Producer approval and vetting',
                  'Complete audit trail of all batches',
                  'GDPR-compliant data handling'
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                <img
                  src="/verification-badge.jpg"
                  alt="Verification badge"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5 border-y border-border">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Trace Your Honey?</h2>
          <p className="text-xl text-muted-foreground">
            Join producers and consumers who are building trust through transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/auth/register?role=producer">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                I&apos;m a Producer
              </Button>
            </Link>
            <Link href="/auth/register?role=consumer">
              <Button size="lg" variant="outline">
                I&apos;m a Consumer
              </Button>
            </Link>
            <Link href="/auth/register?role=admin">
              <Button size="lg" variant="outline">
                I&apos;m an Admin
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">🍯</span>
                </div>
                <span className="font-bold text-lg">HiveTrace</span>
              </div>
              <p className="text-muted-foreground text-sm">Cryptographically verified honey traceability.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link href="#features" className="hover:text-foreground transition">Features</Link></li>
                <li><Link href="#security" className="hover:text-foreground transition">Security</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">© 2024 HiveTrace. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">LinkedIn</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
