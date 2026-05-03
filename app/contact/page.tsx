'use client';

import { PublicHeader } from '@/components/public-header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <PublicHeader />

      <main className="flex-1 pt-20">
        <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
              <Badge className="bg-stone-200 text-stone-800 border-none py-1.5 px-4 rounded-full text-xs font-black uppercase tracking-[0.2em]">
                Get In Touch
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none">
                CONTACT <span className="text-primary not-italic">US.</span>
              </h1>
              <p className="text-xl text-stone-500 font-medium leading-relaxed">
                Whether you're a producer looking to join the network or a consumer with questions about verification, we're here to help.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 space-y-8">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-black uppercase text-lg">Email</h3>
                      <p className="text-stone-500 font-medium">hello@hivetrace.org</p>
                      <p className="text-stone-500 font-medium">support@hivetrace.org</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-black uppercase text-lg">Phone</h3>
                      <p className="text-stone-500 font-medium">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-black uppercase text-lg">Headquarters</h3>
                      <p className="text-stone-500 font-medium">
                        100 Verification Way<br />
                        Tech District, CA 94103<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-xl border border-stone-200">
                  {submitted ? (
                    <div className="text-center py-16 space-y-6">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-10 h-10 text-green-600 ml-1" />
                      </div>
                      <h2 className="text-3xl font-black uppercase">Message Sent</h2>
                      <p className="text-stone-500 font-medium max-w-md mx-auto">
                        Thank you for reaching out. A member of our team will get back to you within 24 hours.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4 font-bold border-2"
                        onClick={() => setSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold uppercase text-stone-500 tracking-widest">First Name</label>
                          <Input required placeholder="Jane" className="h-12 bg-stone-50 border-stone-200" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold uppercase text-stone-500 tracking-widest">Last Name</label>
                          <Input required placeholder="Doe" className="h-12 bg-stone-50 border-stone-200" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase text-stone-500 tracking-widest">Email Address</label>
                        <Input required type="email" placeholder="jane@example.com" className="h-12 bg-stone-50 border-stone-200" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase text-stone-500 tracking-widest">Subject</label>
                        <Input required placeholder="How can we help you?" className="h-12 bg-stone-50 border-stone-200" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold uppercase text-stone-500 tracking-widest">Message</label>
                        <Textarea required placeholder="Tell us more about your inquiry..." className="min-h-[150px] bg-stone-50 border-stone-200 resize-none" />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full h-14 text-lg font-black bg-stone-900 hover:bg-primary text-white"
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
