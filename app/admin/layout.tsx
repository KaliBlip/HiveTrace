'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, Home } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground">⚙️</span>
                </div>
                <span>Admin</span>
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
                className="w-full justify-start"
                title={!sidebarOpen ? 'Dashboard' : ''}
              >
                <span>📊</span>
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
              </Button>
            </Link>
            <Link href="/admin/producers">
              <Button
                variant="ghost"
                className="w-full justify-start"
                title={!sidebarOpen ? 'Producers' : ''}
              >
                <span>👥</span>
                {sidebarOpen && <span className="ml-3">Producers</span>}
              </Button>
            </Link>
            <Link href="/admin/fraud">
              <Button
                variant="ghost"
                className="w-full justify-start"
                title={!sidebarOpen ? 'Fraud Detection' : ''}
              >
                <span>🚨</span>
                {sidebarOpen && <span className="ml-3">Fraud Detection</span>}
              </Button>
            </Link>
            <Link href="/admin/batches">
              <Button
                variant="ghost"
                className="w-full justify-start"
                title={!sidebarOpen ? 'All Batches' : ''}
              >
                <span>🍯</span>
                {sidebarOpen && <span className="ml-3">All Batches</span>}
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button
                variant="ghost"
                className="w-full justify-start"
                title={!sidebarOpen ? 'Reports' : ''}
              >
                <span>📋</span>
                {sidebarOpen && <span className="ml-3">Reports</span>}
              </Button>
            </Link>
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-2">
            <Link href="/">
              <Button
                variant="outline"
                className="w-full justify-start text-xs"
                title={!sidebarOpen ? 'Home' : ''}
              >
                <Home className="w-4 h-4" />
                {sidebarOpen && <span className="ml-3">Home</span>}
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full justify-start text-xs"
              title={!sidebarOpen ? 'Logout' : ''}
            >
              <LogOut className="w-4 h-4" />
              {sidebarOpen && <span className="ml-3">Logout</span>}
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
