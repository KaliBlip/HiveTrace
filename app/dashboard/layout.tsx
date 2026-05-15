import { Sidebar } from '@/components/dashboard/sidebar';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/login');
  }

  const sessionUser = session.user as typeof session.user & { role?: string };
  const role = sessionUser.role?.toLowerCase();
  if (role !== 'producer' && role !== 'admin') {
    redirect('/shop');
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="relative flex-1 overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 hive-grid opacity-70" />
        <div className="relative p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
