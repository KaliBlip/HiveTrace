import { DashboardLayoutClient } from '@/components/dashboard/dashboard-layout-client';
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
    <DashboardLayoutClient>
      {children}
    </DashboardLayoutClient>
  );
}
