"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart, Syringe, Bell, User, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    {
      label: "Início",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Pets",
      icon: Heart,
      href: "/pets",
      active: pathname.startsWith("/pets"),
    },
    {
      label: "Vacinas",
      icon: Syringe,
      href: "/vaccines",
      active: pathname.startsWith("/vaccines"),
    },
    {
      label: "Notificações",
      icon: Bell,
      href: "/notifications",
      active: pathname.startsWith("/notifications"),
    },
    {
      label: "Perfil",
      icon: User,
      href: "/profile",
      active: pathname.startsWith("/profile"),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 mobile-nav-safe">
      <div className="flex items-center justify-around py-2 px-2 sm:px-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            size="sm"
            onClick={() => router.push(item.href)}
            className={cn(
              "flex flex-col items-center space-y-1 h-auto py-3 px-2 sm:px-3 rounded-xl min-h-[60px] flex-1 max-w-[80px]",
              item.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-xs font-medium leading-tight text-center">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  )
}
