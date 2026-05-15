import { PublicHeader } from '@/components/public-header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Globe, Leaf, ShieldCheck, Users } from 'lucide-react';

const principles = [
  {
    icon: ShieldCheck,
    title: 'Tamper-evident records',
    text: 'Every batch is signed so origin, harvest data, and verification details can be checked without trusting packaging alone.',
  },
  {
    icon: Users,
    title: 'Producer-first tooling',
    text: 'Independent beekeepers get a clean workflow for batch registration, listings, scan analytics, orders, and reputation.',
  },
  {
    icon: Globe,
    title: 'Transparent supply chains',
    text: 'Consumers can see where honey came from, who produced it, and whether the batch identity still matches.',
  },
  {
    icon: Leaf,
    title: 'Better incentives',
    text: 'Verified purchases help ethical producers compete on provenance and quality instead of opaque commodity pricing.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader />

      <main className="pb-24 md:pb-0">
        <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 hive-grid" />
          <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div className="motion-rise space-y-6">
              <Badge className="rounded-full border border-primary/25 bg-primary/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                About HiveTrace
              </Badge>
              <h1 className="text-balance font-heading text-5xl font-semibold leading-[0.9] tracking-[-0.03em] sm:text-7xl">
                Building trust for the honey economy.
              </h1>
            </div>
            <div className="motion-rise motion-delay-2 rounded-xl border border-border/60 bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur">
              <p className="text-lg leading-8 text-muted-foreground">
                Honey is frequently adulterated, relabeled, or stripped of meaningful origin data. HiveTrace gives
                producers and consumers a shared verification layer: signed batches, scan history, marketplace listings,
                and reputation signals in one place.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
            {principles.map((item, index) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="motion-rise rounded-xl border border-border/60 bg-card/72 p-6 shadow-[var(--shadow-soft)] backdrop-blur"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <span className="mb-8 grid size-12 place-items-center rounded-md bg-primary/12 text-primary">
                    <Icon className="size-6" />
                  </span>
                  <h2 className="font-heading text-2xl font-semibold tracking-tight">{item.title}</h2>
                  <p className="mt-3 leading-7 text-muted-foreground">{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-xl border border-border/60 bg-foreground text-background shadow-[var(--shadow-lift)] lg:grid-cols-[0.8fr_1.2fr]">
            <div className="min-h-[340px] bg-[url('/hero-beehive.jpg')] bg-cover bg-center" />
            <div className="p-8 sm:p-12 lg:p-16">
              <Badge className="rounded-full bg-background/10 text-background">Our thesis</Badge>
              <h2 className="mt-6 text-balance font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                Authenticity should be visible before the purchase, not argued after.
              </h2>
              <p className="mt-6 text-lg leading-8 text-background/70">
                HiveTrace starts with honey because provenance matters deeply in the category. The same architecture can
                support a broader food system where origin, quality, and accountability are easy to inspect.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
