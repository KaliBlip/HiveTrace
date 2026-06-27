import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './admin-layout-client';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect('/auth/login');
  if ((session.user as { role?: string }).role !== 'ADMIN') redirect('/shop');

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
