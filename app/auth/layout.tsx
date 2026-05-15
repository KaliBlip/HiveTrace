import Image from "next/image";
import { PublicHeader } from '@/components/public-header';
import { Footer } from '@/components/footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-stone-950 text-foreground font-sans flex flex-col relative overflow-hidden">
      {/* Immersive Background Image - Fixed to background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/auth-bg.png"
          alt="Luxury Honey Background"
          fill
          className="object-cover opacity-30 mix-blend-luminosity scale-105 blur-[1px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-950/90 to-stone-950"></div>
      </div>

      {/* Atmospheric Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[140px]"></div>
      </div>

      <PublicHeader />
      
      <main className="flex-1 relative z-10 pt-16">
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[128px]">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
