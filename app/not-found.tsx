import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="pt-12 pb-12 text-center space-y-6">
          <div className="text-6xl font-bold text-muted-foreground">404</div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Page Not Found</h1>
            <p className="text-muted-foreground">
              Sorry, we could not find the page you&apos;re looking for.
            </p>
          </div>
          <Link href="/">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
