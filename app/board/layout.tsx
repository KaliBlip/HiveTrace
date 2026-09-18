import { DashboardLayoutClient } from '@/components/dashboard/dashboard-layout-client';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function BoardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || String((session.user as { role?: string }).role).toUpperCase() !== 'VALIDATION_BOARD') {
    redirect('/auth/login');
  }
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
