import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { PetsList } from "@/components/pets/pets-list"

export default async function PetsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <DashboardHeader user={data.user} />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Meus Pets</h1>
          <p className="text-muted-foreground">Gerencie todos os seus pets em um só lugar</p>
        </div>

        <PetsList />
      </main>

      <MobileNav />
    </div>
  )
}
