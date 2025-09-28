"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Syringe, Calendar, AlertTriangle } from "lucide-react"
import { format, isBefore, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"

interface UpcomingVaccine {
  id: string
  name: string
  next_dose_date: string
  pet: {
    name: string
    species: string
  }
}

export function UpcomingVaccines() {
  const [vaccines, setVaccines] = useState<UpcomingVaccine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchUpcomingVaccines = async () => {
      try {
        const today = new Date()
        const nextMonth = addDays(today, 30)

        const { data, error } = await supabase
          .from("vaccines")
          .select(
            `
            id,
            name,
            next_dose_date,
            pets:pet_id (
              name,
              species
            )
          `,
          )
          .not("next_dose_date", "is", null)
          .lte("next_dose_date", nextMonth.toISOString().split("T")[0])
          .order("next_dose_date", { ascending: true })

        if (error) throw error

        const formattedData = (data || []).map((vaccine) => ({
          id: vaccine.id,
          name: vaccine.name,
          next_dose_date: vaccine.next_dose_date,
          pet: {
            name: vaccine.pets?.name || "Pet",
            species: vaccine.pets?.species || "cachorro",
          },
        }))

        setVaccines(formattedData)
      } catch (error) {
        console.error("Erro ao carregar vacinas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUpcomingVaccines()
  }, [])

  const getVaccineStatus = (date: string) => {
    const vaccineDate = new Date(date)
    const today = new Date()
    const sevenDaysFromNow = addDays(today, 7)

    if (isBefore(vaccineDate, today)) {
      return { status: "overdue", label: "Atrasada", variant: "destructive" as const }
    } else if (isBefore(vaccineDate, sevenDaysFromNow)) {
      return { status: "urgent", label: "Urgente", variant: "default" as const }
    } else {
      return { status: "upcoming", label: "Próxima", variant: "secondary" as const }
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Syringe className="w-5 h-5 text-secondary" />
            <span>Próximas Vacinas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Syringe className="w-5 h-5 text-secondary" />
          <span>Próximas Vacinas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vaccines.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma vacina próxima</h3>
            <p className="text-muted-foreground">Todas as vacinas estão em dia!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {vaccines.map((vaccine) => {
              const status = getVaccineStatus(vaccine.next_dose_date)
              return (
                <div
                  key={vaccine.id}
                  className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                      {status.status === "overdue" ? (
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      ) : (
                        <Syringe className="w-5 h-5 text-secondary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{vaccine.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {vaccine.pet.species === "cachorro" ? "🐕" : "🐱"} {vaccine.pet.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={status.variant} className="mb-1">
                      {status.label}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(vaccine.next_dose_date), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
