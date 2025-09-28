"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Plus, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { PetModal } from "./pet-modal"

interface Pet {
  id: string
  name: string
  species: "cachorro" | "gato"
  breed?: string
  birth_date?: string
  weight?: number
  photo_url?: string
  created_at: string
}

export function PetsList() {
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const fetchPets = async () => {
    try {
      const { data, error } = await supabase.from("pets").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setPets(data || [])
    } catch (error) {
      console.error("Erro ao carregar pets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPets()
  }, [])

  const handleEdit = (pet: Pet) => {
    setSelectedPet(pet)
    setShowModal(true)
  }

  const handleDelete = async (petId: string) => {
    if (!confirm("Tem certeza que deseja excluir este pet? Esta ação não pode ser desfeita.")) return

    try {
      const { error } = await supabase.from("pets").delete().eq("id", petId)
      if (error) throw error
      await fetchPets()
    } catch (error) {
      console.error("Erro ao excluir pet:", error)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSelectedPet(null)
    fetchPets()
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-primary" />
            <span>Meus Pets</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            <Heart className="w-5 h-5 text-primary" />
            <span>Meus Pets</span>
          </CardTitle>
          <Button size="sm" onClick={() => setShowModal(true)} className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </CardHeader>
        <CardContent>
          {pets.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhum pet cadastrado</h3>
              <p className="text-muted-foreground mb-4">
                Adicione seu primeiro pet para começar a cuidar da saúde dele
              </p>
              <Button onClick={() => setShowModal(true)} className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Pet
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{pet.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {pet.species === "cachorro" ? "🐕 Cachorro" : "🐱 Gato"}
                        </Badge>
                        {pet.breed && <span className="text-sm text-muted-foreground">{pet.breed}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(pet)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(pet.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PetModal isOpen={showModal} onClose={handleModalClose} pet={selectedPet} />
    </>
  )
}
