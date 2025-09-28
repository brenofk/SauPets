"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Save, X } from "lucide-react"

interface Pet {
  id: string
  name: string
  species: "cachorro" | "gato"
  breed?: string
  birth_date?: string
  weight?: number
  photo_url?: string
}

interface PetModalProps {
  isOpen: boolean
  onClose: () => void
  pet?: Pet | null
}

export function PetModal({ isOpen, onClose, pet }: PetModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    species: "" as "cachorro" | "gato" | "",
    breed: "",
    birth_date: "",
    weight: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed || "",
        birth_date: pet.birth_date || "",
        weight: pet.weight?.toString() || "",
      })
    } else {
      setFormData({
        name: "",
        species: "",
        breed: "",
        birth_date: "",
        weight: "",
      })
    }
    setError(null)
  }, [pet, isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) return "Nome é obrigatório"
    if (!formData.species) return "Espécie é obrigatória"
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
      const petData = {
        name: formData.name.trim(),
        species: formData.species,
        breed: formData.breed.trim() || null,
        birth_date: formData.birth_date || null,
        weight: formData.weight ? Number.parseFloat(formData.weight) : null,
      }

      if (pet) {
        // Update existing pet
        const { error } = await supabase.from("pets").update(petData).eq("id", pet.id)
        if (error) throw error
      } else {
        // Create new pet
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) throw new Error("Usuário não autenticado")

        const { error } = await supabase.from("pets").insert({
          ...petData,
          user_id: userData.user.id,
        })
        if (error) throw error
      }

      onClose()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao salvar pet")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-primary" />
            <span>{pet ? "Editar Pet" : "Adicionar Pet"}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              placeholder="Nome do pet"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="species">Espécie *</Label>
            <Select value={formData.species} onValueChange={(value) => handleInputChange("species", value)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecione a espécie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cachorro">🐕 Cachorro</SelectItem>
                <SelectItem value="gato">🐱 Gato</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="breed">Raça</Label>
            <Input
              id="breed"
              placeholder="Raça do pet (opcional)"
              value={formData.breed}
              onChange={(e) => handleInputChange("breed", e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_date">Data de Nascimento</Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => handleInputChange("birth_date", e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="Peso em kg"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
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
