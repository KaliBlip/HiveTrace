'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, Home, BarChart3, Users, AlertTriangle, Box, ClipboardList, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      {/* Admin Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            {sidebarOpen && (
              <div className="flex items-center gap-2 font-bold text-lg">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="tracking-tighter uppercase italic">Admin</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
            <Link href="/admin">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                title={!sidebarOpen ? 'Dashboard' : ''}
              >
                <BarChart3 className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">Dashboard</span>}
              </Button>
            </Link>
            <Link href="/admin/producers">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                title={!sidebarOpen ? 'Producers' : ''}
              >
                <Users className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">Producers</span>}
              </Button>
            </Link>
            <Link href="/admin/fraud">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                title={!sidebarOpen ? 'Fraud Detection' : ''}
              >
                <AlertTriangle className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">Fraud Detection</span>}
              </Button>
            </Link>
            <Link href="/admin/batches">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                title={!sidebarOpen ? 'All Batches' : ''}
              >
                <Box className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">All Batches</span>}
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                title={!sidebarOpen ? 'Reports' : ''}
              >
                <ClipboardList className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">Reports</span>}
              </Button>
            </Link>
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-2">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground ${!sidebarOpen && 'justify-center'}`}>
              <ThemeToggle />
              {sidebarOpen && <span>Appearance</span>}
            </div>
            <Link href="/">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 text-xs"
                title={!sidebarOpen ? 'Home' : ''}
              >
                <Home className="w-4 h-4" />
                {sidebarOpen && <span>Home</span>}
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 text-xs"
              onClick={() => logout()}
              title={!sidebarOpen ? 'Logout' : ''}
            >
              <LogOut className="w-4 h-4" />
              {sidebarOpen && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 flex-1 overflow-y-auto ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
