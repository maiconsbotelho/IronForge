"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Dumbbell,
  Timer,
  BarChart2,
  User,
  ClipboardList,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/UserAvatar";

const navItems = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/workouts", icon: Dumbbell, label: "Treino" },
  { href: "/exercises", icon: Activity, label: "Exercícios" },
  { href: "/plans", icon: ClipboardList, label: "Fichas" },
  { href: "/stats", icon: BarChart2, label: "Stats" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border md:hidden">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Top Nav */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-black italic tracking-tighter text-primary"
              >
                IRONFORGE
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-zinc-800 hover:text-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <UserAvatar />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
