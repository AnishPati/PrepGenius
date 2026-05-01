"use client";

import { Link, useLocation } from "react-router-dom";
import { BookOpen, BarChart3, Home, Zap } from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 h-14">
        <Link to="/" className="flex items-center gap-2 font-bold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline">PrepAI</span>
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
