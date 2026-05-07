'use client';

import { PublicHeader } from '@/components/public-header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { submitContactMessage } from '@/lib/actions/contact-actions';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await submitContactMessage(formData);
      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <PublicHeader />

      <main className="flex-1 pt-16">
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[128px] relative z-10">
            <div className="mb-20 flex w-full justify-center">
              <div className="w-full px-2 text-center" style={{ maxWidth: "880px" }}>
                <div className="flex justify-center">
                  <Badge className="bg-primary/10 text-primary border-primary/20 py-1.5 px-4 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
                    Get In Touch
                  </Badge>
                </div>
                <h1 className="mt-6 text-5xl md:text-7xl font-heading font-bold tracking-[-0.02em] uppercase italic leading-none">
                  CONTACT <span className="text-primary not-italic">US.</span>
                </h1>
                <div
                  className="mx-auto mt-8 text-xl text-stone-500 font-normal leading-relaxed"
                  style={{ width: "100%", maxWidth: "720px", whiteSpace: "normal" }}
                >
                  Whether you're a producer looking to join the network or a consumer with questions about verification, we're here to help.
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-16">
              {/* Contact Info */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-card p-10 rounded-[24px] shadow-sm border border-border/50 space-y-10">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold uppercase text-lg tracking-tight">Email</h3>
                      <p className="text-stone-500 font-normal">hello@hivetrace.org</p>
                      <p className="text-stone-500 font-normal">support@hivetrace.org</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold uppercase text-lg tracking-tight">Phone</h3>
                      <p className="text-stone-500 font-normal">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold uppercase text-lg tracking-tight">Headquarters</h3>
                      <p className="text-stone-500 font-normal leading-relaxed">
                        100 Verification Way<br />
                        Tech District, CA 94103<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-8">
                <div className="bg-card p-8 lg:p-14 rounded-[32px] shadow-xl border border-border/50">
                  {submitted ? (
                    <div className="text-center py-16 space-y-8">
                      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-10 h-10 text-green-600 ml-1" />
                      </div>
                      <div className="space-y-4">
                        <h2 className="text-4xl font-heading font-bold uppercase tracking-tight">Message Sent</h2>
                        <p className="text-lg text-stone-500 font-normal max-w-md mx-auto">
                          Thank you for reaching out. A member of our team will get back to you within 24 hours.
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="mt-4 font-bold border-2 rounded-full px-8"
                        onClick={() => setSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {error && (
                        <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-xl text-sm font-medium">
                          {error}
                        </div>
                      )}
                      <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-xs font-bold uppercase text-stone-400 tracking-[0.1em] ml-1">First Name</label>
                          <Input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Jane" className="h-14 bg-background border-border/50 rounded-xl px-5" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-bold uppercase text-stone-400 tracking-[0.1em] ml-1">Last Name</label>
                          <Input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" className="h-14 bg-background border-border/50 rounded-xl px-5" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-stone-400 tracking-[0.1em] ml-1">Email Address</label>
                        <Input name="email" value={formData.email} onChange={handleChange} required type="email" placeholder="jane@example.com" className="h-14 bg-background border-border/50 rounded-xl px-5" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-stone-400 tracking-[0.1em] ml-1">Subject</label>
                        <Input name="subject" value={formData.subject} onChange={handleChange} required placeholder="How can we help you?" className="h-14 bg-background border-border/50 rounded-xl px-5" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase text-stone-400 tracking-[0.1em] ml-1">Message</label>
                        <Textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Tell us more about your inquiry..." className="min-h-[180px] bg-background border-border/50 rounded-xl p-5 resize-none" />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-16 text-xl font-bold rounded-full transition-all active:scale-[0.98]"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
