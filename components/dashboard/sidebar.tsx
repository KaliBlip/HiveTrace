"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Box,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Star,
  Users,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";

const producerMenuItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/batches", label: "Batches", icon: Box },
  { href: "/dashboard/products", label: "Listings", icon: ShoppingBag },
  { href: "/dashboard/orders", label: "Orders", icon: Package },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const consumerMenuItems = [
  { href: "/consumer", label: "Home", icon: Home },
  { href: "/shop", label: "Marketplace", icon: ShoppingBag },
  { href: "/consumer/scanner", label: "Scanner", icon: Smartphone },
  { href: "/consumer/orders", label: "Orders", icon: Package },
];

const adminMenuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/producers", label: "Producers", icon: Users },
  { href: "/admin/fraud", label: "Fraud Detection", icon: AlertTriangle },
  { href: "/admin/batches", label: "All Batches", icon: Box },
  { href: "/admin/reports", label: "Reports", icon: ClipboardList },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, role, logout } = useAuth();

  const currentRole = role?.toLowerCase();
  const menuItems =
    currentRole === "producer"
      ? producerMenuItems
      : currentRole === "admin"
        ? adminMenuItems
        : consumerMenuItems;

  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-sidebar-border/70 bg-sidebar/82 text-sidebar-foreground shadow-[var(--shadow-soft)] backdrop-blur-2xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "lg:w-[5.5rem]" : "lg:w-72",
          "w-72"
        )}
      >
        <button
          onClick={() => setIsCollapsed((collapsed) => !collapsed)}
          className="absolute -right-3 top-20 hidden lg:grid size-7 place-items-center rounded-full border border-border bg-background text-foreground shadow-sm transition-transform hover:scale-105"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={cn("p-5", isCollapsed && "px-4")}>
          <Link href="/" className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
            <span className="scan-line grid size-11 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <ShieldCheck className="size-5" />
            </span>
            {!isCollapsed && (
              <span className="font-heading text-2xl font-semibold tracking-tight motion-rise">
                Hive<span className="text-primary">Trace</span>
              </span>
            )}
          </Link>
        </div>

        {user && (
          <div className={cn("mx-4 mb-4 rounded-lg border border-sidebar-border/70 bg-background/38 p-3", isCollapsed && "mx-3 p-2")}>
            <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
              <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-md border border-sidebar-border/70 bg-card">
                {user.image ? (
                  <img src={user.image} alt={user.name || ""} className="size-full object-cover" />
                ) : (
                  <span className="font-heading text-sm font-semibold uppercase text-primary">
                    {user.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-tight">{user.name}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {currentRole || "user"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "motion-rise flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition-all",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center px-2",
                )}
                style={{ animationDelay: `${index * 35}ms` }}
              >
                <Icon className="size-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-sidebar-border/70 p-4">
          {!isCollapsed && (
            <div className="flex items-center justify-between rounded-md border border-sidebar-border/70 bg-background/38 px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          )}

          <Button
            variant="outline"
            className={cn("w-full gap-3", isCollapsed && "mx-auto size-11 p-0")}
            onClick={() => logout()}
            title={isCollapsed ? "Sign out" : undefined}
          >
            <LogOut className="size-4" />
            {!isCollapsed && <span>Sign out</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
