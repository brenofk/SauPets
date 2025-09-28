"use client"

import type React from "react"
import type { User } from "@supabase/supabase-js"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserIcon, Mail, Phone, Lock, Trash2, Save } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfileSettingsProps {
  user: User
}

interface Profile {
  cpf: string
  full_name: string
  phone?: string
  email_confirmed: boolean
  phone_confirmed: boolean
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle() // Use maybeSingle() instead of single() to handle no results gracefully

      if (error) {
        console.error("Database error:", error)
        throw error
      }

      if (!data) {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || "",
            cpf: user.user_metadata?.cpf || "",
            email_confirmed: user.email_confirmed_at ? true : false,
            phone_confirmed: false,
          })
          .select()
          .single()

        if (createError) {
          console.error("Error creating profile:", createError)
          throw createError
        }

        setProfile(newProfile)
        setFormData({
          full_name: newProfile.full_name || "",
          phone: newProfile.phone || "",
          email: user.email || "",
        })
      } else {
        setProfile(data)
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
          email: user.email || "",
        })
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error)
      setError("Erro ao carregar perfil. Tente novamente.")
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone.replace(/\D/g, ""),
        })
        .eq("id", user.id)

      if (profileError) throw profileError

      // Update email if changed
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email,
        })
        if (emailError) throw emailError
      }

      setSuccess("Perfil atualizado com sucesso!")
      await fetchProfile()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao atualizar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (error) throw error

      setSuccess("Senha alterada com sucesso!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao alterar senha")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (
      !confirm(
        "ATENÇÃO: Esta ação irá excluir permanentemente sua conta e todos os dados associados. Esta ação não pode ser desfeita. Tem certeza que deseja continuar?",
      )
    ) {
      return
    }

    if (
      !confirm(
        "Última confirmação: Você realmente deseja excluir sua conta? Todos os seus pets, vacinas e dados serão perdidos para sempre.",
      )
    ) {
      return
    }

    try {
      setIsLoading(true)

      // Delete user data (RLS will handle cascade)
      const { error: deleteError } = await supabase.from("profiles").delete().eq("id", user.id)

      if (deleteError) throw deleteError

      // Sign out and redirect
      await supabase.auth.signOut()
      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao excluir conta")
      setIsLoading(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="w-32 h-6 bg-muted rounded"></div>
                <div className="space-y-3">
                  <div className="w-full h-10 bg-muted rounded"></div>
                  <div className="w-full h-10 bg-muted rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5 text-primary" />
            <span>Informações Pessoais</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" value={profile ? formatCPF(profile.cpf) : ""} disabled className="rounded-xl bg-muted" />
              <p className="text-xs text-muted-foreground">O CPF não pode ser alterado</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              {!profile?.email_confirmed && <p className="text-xs text-destructive">Email não confirmado</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formatPhone(formData.phone)}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  maxLength={15}
                  className="pl-10 rounded-xl"
                />
              </div>
              {formData.phone && !profile?.phone_confirmed && (
                <p className="text-xs text-destructive">Telefone não confirmado</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full rounded-xl">
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-secondary" />
            <span>Alterar Senha</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={updatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme a nova senha"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                className="rounded-xl"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full rounded-xl">
              <Lock className="w-4 h-4 mr-2" />
              {isLoading ? "Alterando..." : "Alterar Senha"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            <span>Zona de Perigo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
              <h3 className="font-medium text-destructive mb-2">Excluir Conta</h3>
              <p className="text-sm text-destructive/80 mb-4">
                Esta ação irá excluir permanentemente sua conta e todos os dados associados (pets, vacinas,
                notificações). Esta ação não pode ser desfeita.
              </p>
              <Button
                variant="destructive"
                onClick={deleteAccount}
                disabled={isLoading}
                className="w-full sm:w-auto rounded-xl text-sm px-4 py-2 min-h-[44px] touch-manipulation"
              >
                <Trash2 className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-center">Excluir Conta Permanentemente</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
          <p className="text-sm text-primary">{success}</p>
        </div>
      )}
    </div>
  )
}
