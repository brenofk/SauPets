"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Syringe, Save, X } from "lucide-react"

interface Pet {
  id: string
  name: string
  species: string
}

interface Vaccine {
  id: string
  name: string
  description?: string
  application_date: string
  next_dose_date?: string
  veterinarian?: string
  batch_number?: string
  pet_id: string
}

interface VaccineModalProps {
  isOpen: boolean
  onClose: () => void
  vaccine?: Vaccine | null
}

export function VaccineModal({ isOpen, onClose, vaccine }: VaccineModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    application_date: "",
    next_dose_date: "",
    veterinarian: "",
    batch_number: "",
    pet_id: "",
  })
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      fetchPets()
    }
  }, [isOpen])

  useEffect(() => {
    if (vaccine) {
      setFormData({
        name: vaccine.name,
        description: vaccine.description || "",
        application_date: vaccine.application_date,
        next_dose_date: vaccine.next_dose_date || "",
        veterinarian: vaccine.veterinarian || "",
        batch_number: vaccine.batch_number || "",
        pet_id: vaccine.pet_id,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        application_date: "",
        next_dose_date: "",
        veterinarian: "",
        batch_number: "",
        pet_id: "",
      })
    }
    setError(null)
  }, [vaccine, isOpen])

  const fetchPets = async () => {
    try {
      const { data, error } = await supabase.from("pets").select("id, name, species").order("name")

      if (error) throw error
      setPets(data || [])
    } catch (error) {
      console.error("Erro ao carregar pets:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) return "Nome da vacina é obrigatório"
    if (!formData.application_date) return "Data de aplicação é obrigatória"
    if (!formData.pet_id) return "Pet é obrigatório"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      const vaccineData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        application_date: formData.application_date,
        next_dose_date: formData.next_dose_date || null,
        veterinarian: formData.veterinarian.trim() || null,
        batch_number: formData.batch_number.trim() || null,
        pet_id: formData.pet_id,
      }

      if (vaccine) {
        // Update existing vaccine
        const { error } = await supabase.from("vaccines").update(vaccineData).eq("id", vaccine.id)
        if (error) throw error
      } else {
        // Create new vaccine
        const { error } = await supabase.from("vaccines").insert(vaccineData)
        if (error) throw error
      }

      onClose()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao salvar vacina")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Syringe className="w-5 h-5 text-secondary" />
            <span>{vaccine ? "Editar Vacina" : "Nova Vacina"}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pet_id">Pet *</Label>
            <Select value={formData.pet_id} onValueChange={(value) => handleInputChange("pet_id", value)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecione o pet" />
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.species === "cachorro" ? "🐕" : "🐱"} {pet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome da Vacina *</Label>
            <Input
              id="name"
              placeholder="Ex: V8, Antirrábica, Tríplice Felina"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição da vacina (opcional)"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="rounded-xl resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="application_date">Data de Aplicação *</Label>
            <Input
              id="application_date"
              type="date"
              value={formData.application_date}
              onChange={(e) => handleInputChange("application_date", e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="next_dose_date">Próxima Dose</Label>
            <Input
              id="next_dose_date"
              type="date"
              value={formData.next_dose_date}
              onChange={(e) => handleInputChange("next_dose_date", e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="veterinarian">Veterinário</Label>
            <Input
              id="veterinarian"
              placeholder="Nome do veterinário (opcional)"
              value={formData.veterinarian}
              onChange={(e) => handleInputChange("veterinarian", e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="batch_number">Lote</Label>
            <Input
              id="batch_number"
              placeholder="Número do lote (opcional)"
              value={formData.batch_number}
              onChange={(e) => handleInputChange("batch_number", e.target.value)}
              className="rounded-xl"
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl bg-transparent">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 rounded-xl">
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
