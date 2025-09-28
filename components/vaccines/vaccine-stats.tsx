"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Syringe, Calendar, AlertTriangle, CheckCircle } from "lucide-react"
import { addDays, isBefore } from "date-fns"

interface VaccineStats {
  total: number
  upToDate: number
  upcoming: number
  overdue: number
}

export function VaccineStats() {
  const [stats, setStats] = useState<VaccineStats>({
    total: 0,
    upToDate: 0,
    upcoming: 0,
    overdue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.from("vaccines").select("next_dose_date")

        if (error) throw error

        const today = new Date()
        const thirtyDaysFromNow = addDays(today, 30)

        let upToDate = 0
        let upcoming = 0
        let overdue = 0

        data?.forEach((vaccine) => {
          if (!vaccine.next_dose_date) {
            upToDate++
          } else {
            const nextDose = new Date(vaccine.next_dose_date)
            if (isBefore(nextDose, today)) {
              overdue++
            } else if (isBefore(nextDose, thirtyDaysFromNow)) {
              upcoming++
            } else {
              upToDate++
            }
          }
        })

        setStats({
          total: data?.length || 0,
          upToDate,
          upcoming,
          overdue,
        })
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-lg mb-2"></div>
                <div className="w-16 h-6 bg-muted rounded mb-1"></div>
                <div className="w-20 h-4 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: "Total",
      value: stats.total,
      icon: Syringe,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Em Dia",
      value: stats.upToDate,
      icon: CheckCircle,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Próximas",
      value: stats.upcoming,
      icon: Calendar,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Atrasadas",
      value: stats.overdue,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
