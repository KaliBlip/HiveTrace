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
        "bg-card border-r border-border/50 h-screen flex flex-col sticky top-0 transition-all duration-300 ease-in-out z-50",
        isCollapsed ? "w-24" : "w-72"
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-50 border-4 border-background"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header */}
      <div className={cn(
        "p-8 overflow-hidden",
        isCollapsed && "flex justify-center px-4"
      )}>
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 bg-primary rounded-[12px] flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="font-heading font-bold text-2xl tracking-tighter italic uppercase animate-in fade-in slide-in-from-left-2 duration-300">
              Hive<span className="text-primary not-italic">Trace</span>
            </span>
          )}
        </Link>
      </div>

      {/* User Info */}
      {user && (
        <div className={cn(
          "px-8 py-6 mb-4 overflow-hidden flex items-center gap-4",
          isCollapsed && "justify-center px-4"
        )}>
          <div className="w-11 h-11 rounded-full bg-primary/5 flex items-center justify-center shrink-0 overflow-hidden border-2 border-border/50">
            {user.image ? (
              <img src={user.image} alt={user.name || ""} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary font-heading font-bold text-sm uppercase">
                {user.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground truncate leading-tight">
                {user.name}
              </p>
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-0.5">{currentRole}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                  : "text-stone-500 hover:bg-primary/5 hover:text-primary",
                isCollapsed && "justify-center px-2 py-4"
              )}
            >
              <Icon size={isCollapsed ? 24 : 20} className={cn("shrink-0", !isActive && "group-hover:scale-110 transition-transform")} />
              {!isCollapsed && (
                <span className="whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300 tracking-tight">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-border/50 mt-auto space-y-4">
        {!isCollapsed && (
          <div className="flex items-center justify-between px-2 text-stone-500">
            <span className="text-xs font-bold uppercase tracking-widest">Theme</span>
            <ThemeToggle />
          </div>
        )}
        
        <Button
          variant={isCollapsed ? "ghost" : "outline"}
          className={cn(
            "w-full transition-all flex items-center gap-3 h-14 rounded-xl border-2 border-border/50 font-bold",
            isCollapsed && "p-0 h-14 w-14 mx-auto justify-center rounded-full border-0 bg-primary/5 text-primary hover:bg-primary/10"
          )}
          onClick={() => logout()}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut size={isCollapsed ? 24 : 20} />
          {!isCollapsed && <span className="tracking-tight">Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}
