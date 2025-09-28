"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Syringe, Plus, Edit, Trash2, Calendar, AlertTriangle } from "lucide-react"
import { VaccineModal } from "./vaccine-modal"
import { format, isBefore, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Vaccine {
  id: string
  name: string
  description?: string
  application_date: string
  next_dose_date?: string
  veterinarian?: string
  batch_number?: string
  pet_id: string
  pets: {
    name: string
    species: string
  }
}

export function VaccinesList() {
  const [vaccines, setVaccines] = useState<Vaccine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null)
  const supabase = createClient()

  const fetchVaccines = async () => {
    try {
      const { data, error } = await supabase
        .from("vaccines")
        .select(
          `
          *,
          pets:pet_id (
            name,
            species
          )
        `,
        )
        .order("application_date", { ascending: false })

      if (error) throw error
      setVaccines(data || [])
    } catch (error) {
      console.error("Erro ao carregar vacinas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVaccines()
  }, [])

  const handleEdit = (vaccine: Vaccine) => {
    setSelectedVaccine(vaccine)
    setShowModal(true)
  }

  const handleDelete = async (vaccineId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta vacina? Esta ação não pode ser desfeita.")) return

    try {
      const { error } = await supabase.from("vaccines").delete().eq("id", vaccineId)
      if (error) throw error
      await fetchVaccines()
    } catch (error) {
      console.error("Erro ao excluir vacina:", error)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSelectedVaccine(null)
    fetchVaccines()
  }

  const getVaccineStatus = (nextDoseDate?: string) => {
    if (!nextDoseDate) return null

    const vaccineDate = new Date(nextDoseDate)
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
            <span>Histórico de Vacinas</span>
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
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Syringe className="w-5 h-5 text-secondary" />
            <span>Histórico de Vacinas</span>
          </CardTitle>
          <Button size="sm" onClick={() => setShowModal(true)} className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Nova Vacina
          </Button>
        </CardHeader>
        <CardContent>
          {vaccines.length === 0 ? (
            <div className="text-center py-8">
              <Syringe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma vacina registrada</h3>
              <p className="text-muted-foreground mb-4">
                Adicione a primeira vacina para começar o controle de saúde dos seus pets
              </p>
              <Button onClick={() => setShowModal(true)} className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Vacina
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {vaccines.map((vaccine) => {
                const status = getVaccineStatus(vaccine.next_dose_date)
                return (
                  <div
                    key={vaccine.id}
                    className="flex items-start justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        {status?.status === "overdue" ? (
                          <AlertTriangle className="w-6 h-6 text-destructive" />
                        ) : (
                          <Syringe className="w-6 h-6 text-secondary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-foreground truncate">{vaccine.name}</h3>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {vaccine.pets?.species === "cachorro" ? "🐕" : "🐱"} {vaccine.pets?.name}
                          </Badge>
                        </div>
                        {vaccine.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{vaccine.description}</p>
                        )}
                        <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Aplicada: {format(new Date(vaccine.application_date), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          </div>
                          {vaccine.next_dose_date && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Próxima: {format(new Date(vaccine.next_dose_date), "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                              {status && (
                                <Badge variant={status.variant} className="text-xs ml-2">
                                  {status.label}
                                </Badge>
                              )}
                            </div>
                          )}
                          {vaccine.veterinarian && (
                            <div className="text-xs">
                              <span>Veterinário: {vaccine.veterinarian}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(vaccine)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(vaccine.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <VaccineModal isOpen={showModal} onClose={handleModalClose} vaccine={selectedVaccine} />
    </>
  )
}
