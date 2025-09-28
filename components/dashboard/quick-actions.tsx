"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Syringe } from "lucide-react"
import { useRouter } from "next/navigation"

export function QuickActions() {
  const router = useRouter()

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
          <Button
            variant="outline"
            className="h-16 sm:h-20 flex-col space-y-1 sm:space-y-2 bg-primary/5 border-primary/20 hover:bg-primary/10 min-h-[64px] touch-manipulation"
            onClick={() => router.push("/pets/new")}
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center leading-tight">Adicionar Pet</span>
          </Button>

          <Button
            variant="outline"
            className="h-16 sm:h-20 flex-col space-y-1 sm:space-y-2 bg-secondary/5 border-secondary/20 hover:bg-secondary/10 min-h-[64px] touch-manipulation"
            onClick={() => router.push("/vaccines/new")}
          >
            <Syringe className="w-5 h-5 sm:w-6 sm:h-6 text-secondary flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center leading-tight">Nova Vacina</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
