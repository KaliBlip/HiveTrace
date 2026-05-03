"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Box, 
  ShoppingBag, 
  Package, 
  BarChart3, 
  Star, 
  Settings, 
  Home, 
  Smartphone, 
  Users, 
  AlertTriangle, 
  Search,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Shield
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const producerMenuItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/batches", label: "My Batches", icon: Box },
  { href: "/dashboard/products", label: "Marketplace", icon: ShoppingBag },
  { href: "/dashboard/orders", label: "Orders", icon: Package },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const consumerMenuItems = [
  { href: "/consumer", label: "Home", icon: Home },
  { href: "/shop", label: "Marketplace", icon: ShoppingBag },
  { href: "/consumer/scanner", label: "Scan Honey", icon: Smartphone },
  { href: "/consumer/orders", label: "My Orders", icon: Package },
];

const adminMenuItems = [
  { href: "/admin", label: "Dashboard", icon: Search },
  { href: "/admin/sellers", label: "Manage Sellers", icon: Users },
  { href: "/admin/fraud", label: "Fraud Alerts", icon: AlertTriangle },
];

export function Sidebar() {
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
    <aside 
      className={cn(
        "bg-sidebar border-r border-sidebar-border h-screen flex flex-col sticky top-0 transition-all duration-300 ease-in-out z-50",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header */}
      <div className={cn(
        "p-6 border-b border-sidebar-border overflow-hidden",
        isCollapsed && "flex justify-center px-4"
      )}>
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
              HiveTrace
            </span>
          )}
        </Link>
      </div>

      {/* User Info */}
      {user && (
        <div className={cn(
          "px-6 py-4 bg-sidebar-accent/5 overflow-hidden flex items-center gap-3",
          isCollapsed && "justify-center px-4"
        )}>
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border border-sidebar-border">
            {user.image ? (
              <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary font-bold text-xs uppercase">
                {user.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-sidebar-foreground/70 capitalize">{currentRole}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-primary/10 hover:text-primary",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Icon size={isCollapsed ? 22 : 18} className={cn("shrink-0", !isActive && "group-hover:scale-110 transition-transform")} />
              {!isCollapsed && (
                <span className="whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border mt-auto space-y-2">
        <div className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all text-sidebar-foreground",
          isCollapsed && "justify-center px-0"
        )}>
          <ThemeToggle />
          {!isCollapsed && <span className="ml-1">Appearance</span>}
        </div>
        
        <Button
          variant="outline"
          className={cn(
            "w-full transition-all flex items-center gap-2",
            isCollapsed && "p-0 h-10 w-10 mx-auto justify-center rounded-full"
          )}
          onClick={() => logout()}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}
