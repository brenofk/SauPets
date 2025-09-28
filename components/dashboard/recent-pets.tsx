"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Plus, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface Pet {
  id: string
  name: string
  species: "cachorro" | "gato"
  breed?: string
  created_at: string
}

export function RecentPets() {
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchRecentPets = async () => {
      try {
        const { data, error } = await supabase
          .from("pets")
          .select("id, name, species, breed, created_at")
          .order("created_at", { ascending: false })
          .limit(3)

        if (error) throw error
        setPets(data || [])
      } catch (error) {
        console.error("Erro ao carregar pets recentes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentPets()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-primary" />
            <span>Pets Recentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-xl"></div>
                <div className="flex-1">
                  <div className="w-24 h-4 bg-muted rounded mb-1"></div>
                  <div className="w-16 h-3 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-3 sm:pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
          <span className="text-base sm:text-lg">Pets Recentes</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/pets")}
          className="text-primary self-start sm:self-auto"
        >
          Ver todos
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        {pets.length === 0 ? (
          <div className="text-center py-4 sm:py-6">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-2 sm:mb-3" />
            <p className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-3">Nenhum pet cadastrado ainda</p>
            <Button
              size="sm"
              onClick={() => router.push("/pets")}
              className="rounded-xl min-h-[44px] touch-manipulation"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Pet
            </Button>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="flex items-center space-x-3 p-2.5 sm:p-3 border border-border rounded-lg sm:rounded-xl hover:bg-muted/50 transition-colors cursor-pointer min-h-[60px] touch-manipulation"
                onClick={() => router.push("/pets")}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm sm:text-base truncate">{pet.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {pet.species === "cachorro" ? "🐕 Cachorro" : "🐱 Gato"}
                    </Badge>
                    {pet.breed && <span className="text-xs text-muted-foreground truncate">{pet.breed}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
