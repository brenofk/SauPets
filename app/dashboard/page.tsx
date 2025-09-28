import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentPets } from "@/components/dashboard/recent-pets"
import { UpcomingVaccines } from "@/components/vaccines/upcoming-vaccines"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <DashboardHeader user={data.user} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Acompanhe a saúde dos seus pets</p>
        </div>

        <DashboardStats />
        <QuickActions />

        <div className="grid gap-6">
          <RecentPets />
          <UpcomingVaccines />
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
