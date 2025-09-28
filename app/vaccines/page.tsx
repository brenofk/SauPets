import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { VaccinesList } from "@/components/vaccines/vaccines-list"
import { VaccineStats } from "@/components/vaccines/vaccine-stats"

export default async function VaccinesPage() {
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Vacinas</h1>
          <p className="text-muted-foreground">Gerencie o histórico de vacinas dos seus pets</p>
        </div>

        <VaccineStats />
        <VaccinesList />
      </main>

      <MobileNav />
    </div>
  )
}
