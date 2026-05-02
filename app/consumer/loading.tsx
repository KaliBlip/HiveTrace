import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ConsumerLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mock Header */}
      <div className="h-16 border-b border-border bg-background"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24 animate-pulse">
        {/* Hero Skeleton */}
        <section className="text-center space-y-8">
          <div className="space-y-4">
            <div className="h-16 w-3/4 mx-auto bg-muted rounded-lg"></div>
            <div className="h-4 w-1/2 mx-auto bg-muted rounded-md"></div>
          </div>
          <div className="flex justify-center gap-4">
            <div className="h-16 w-48 bg-muted rounded-xl"></div>
            <div className="h-16 w-48 bg-muted rounded-xl"></div>
          </div>
        </section>

        {/* How It Works Skeleton */}
        <section className="space-y-12">
          <div className="space-y-2 flex flex-col items-center">
            <div className="h-8 w-64 bg-muted rounded"></div>
            <div className="h-4 w-96 bg-muted rounded"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-border">
                <CardHeader>
                  <div className="w-14 h-14 bg-muted rounded-xl mb-4"></div>
                  <div className="h-6 w-40 bg-muted rounded"></div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded"></div>
                  <div className="h-4 w-5/6 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Producers Skeleton */}
        <section className="space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="h-8 w-72 bg-muted rounded"></div>
              <div className="h-4 w-64 bg-muted rounded"></div>
            </div>
            <div className="h-10 w-24 bg-muted rounded"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-border h-96">
                <CardHeader>
                  <div className="w-14 h-14 bg-muted rounded-xl mb-4"></div>
                  <div className="h-6 w-48 bg-muted rounded"></div>
                  <div className="h-4 w-32 bg-muted rounded mt-2"></div>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted rounded"></div>
                    <div className="h-3 w-full bg-muted rounded"></div>
                    <div className="h-3 w-2/3 bg-muted rounded"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 bg-muted rounded-lg"></div>
                    <div className="h-12 bg-muted rounded-lg"></div>
                  </div>
                  <div className="h-10 w-full bg-muted rounded-md mt-auto"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
