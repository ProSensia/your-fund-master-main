import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  FileText,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Receipt, label: "Expenses", path: "/expenses" },
  { icon: Wallet, label: "Funds", path: "/funds" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: User, label: "Personal/FBR", path: "/personal" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border"
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">FundTrack</h1>
            <p className="text-xs text-muted-foreground">Expense Manager</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <User className="h-4 w-4 text-sidebar-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sidebar-foreground truncate">Guest User</p>
              <p className="text-xs text-muted-foreground">Sign in for more</p>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
