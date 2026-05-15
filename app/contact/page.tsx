'use client';

import { useState } from 'react';
import { Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { PublicHeader } from '@/components/public-header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitContactMessage } from '@/lib/actions/contact-actions';

const contactMethods = [
  { icon: Mail, title: 'Email', lines: ['hello@hivetrace.org', 'support@hivetrace.org'] },
  { icon: Phone, title: 'Phone', lines: ['+1 (555) 123-4567'] },
  { icon: MapPin, title: 'Office', lines: ['100 Verification Way', 'Tech District, CA 94103'] },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await submitContactMessage(formData);
      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <PublicHeader />

      <main className="flex-1 pb-24 md:pb-0">
        <section className="relative overflow-hidden px-4 pb-12 pt-28 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 hive-grid" />
          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-3xl space-y-6">
              <Badge className="rounded-full border border-primary/25 bg-primary/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Contact
              </Badge>
              <h1 className="text-balance font-heading text-5xl font-semibold leading-[0.9] tracking-[-0.03em] sm:text-7xl">
                Tell us what you need to verify.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Producer onboarding, verification questions, suspicious labels, marketplace support: send the signal and
                the team will route it.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="space-y-4">
              {contactMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div key={method.title} className="rounded-xl border border-border/60 bg-card/72 p-5 shadow-[var(--shadow-soft)] backdrop-blur">
                    <span className="mb-5 grid size-11 place-items-center rounded-md bg-primary/12 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <h2 className="font-heading text-xl font-semibold tracking-tight">{method.title}</h2>
                    <div className="mt-2 space-y-1 text-muted-foreground">
                      {method.lines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </aside>

            <div className="rounded-xl border border-border/60 bg-card/72 p-5 shadow-[var(--shadow-soft)] backdrop-blur sm:p-8 lg:p-10">
              {submitted ? (
                <div className="grid min-h-[520px] place-items-center text-center">
                  <div className="max-w-md">
                    <span className="mx-auto mb-6 grid size-16 place-items-center rounded-lg bg-primary/12 text-primary">
                      <Send className="size-7" />
                    </span>
                    <h2 className="font-heading text-4xl font-semibold tracking-tight">Message sent</h2>
                    <p className="mt-4 leading-7 text-muted-foreground">
                      Thanks for reaching out. A HiveTrace team member will get back to you within 24 hours.
                    </p>
                    <Button variant="outline" className="mt-8" onClick={() => setSubmitted(false)}>
                      Send another message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border/60 pb-6">
                    <span className="grid size-11 place-items-center rounded-md bg-foreground text-background">
                      <MessageSquare className="size-5" />
                    </span>
                    <div>
                      <h2 className="font-heading text-2xl font-semibold tracking-tight">Support request</h2>
                      <p className="text-sm text-muted-foreground">We usually reply within one business day.</p>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-md border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                      {error}
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="First name">
                      <Input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Jane" className="h-12 bg-background/70" />
                    </Field>
                    <Field label="Last name">
                      <Input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" className="h-12 bg-background/70" />
                    </Field>
                  </div>

                  <Field label="Email address">
                    <Input name="email" value={formData.email} onChange={handleChange} required type="email" placeholder="jane@example.com" className="h-12 bg-background/70" />
                  </Field>

                  <Field label="Subject">
                    <Input name="subject" value={formData.subject} onChange={handleChange} required placeholder="Producer onboarding" className="h-12 bg-background/70" />
                  </Field>

                  <Field label="Message">
                    <Textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Tell us what happened, what you scanned, or what you want to set up..." className="min-h-44 resize-none bg-background/70" />
                  </Field>

                  <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
                    <Send className="size-4" />
                    {isSubmitting ? 'Sending...' : 'Send message'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
