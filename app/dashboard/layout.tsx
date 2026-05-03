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

  const role = (session.user as any).role?.toLowerCase();
  if (role !== 'producer' && role !== 'admin') {
    redirect('/shop');
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
