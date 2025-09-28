"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Trash2, AlertTriangle, Info, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Notification {
  id: string
  title: string
  message: string
  type: "vaccine_reminder" | "general" | "system"
  is_read: boolean
  scheduled_for?: string
  created_at: string
  pets?: {
    name: string
    species: string
  }
  vaccines?: {
    name: string
  }
}

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread" | "vaccine_reminder">("all")
  const supabase = createClient()

  const fetchNotifications = async () => {
    try {
      let query = supabase
        .from("notifications")
        .select(
          `
          *,
          pets:pet_id (
            name,
            species
          ),
          vaccines:vaccine_id (
            name
          )
        `,
        )
        .order("created_at", { ascending: false })

      if (filter === "unread") {
        query = query.eq("is_read", false)
      } else if (filter === "vaccine_reminder") {
        query = query.eq("type", "vaccine_reminder")
      }

      const { data, error } = await query

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error("Erro ao carregar notificações:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

      if (error) throw error
      await fetchNotifications()
    } catch (error) {
      console.error("Erro ao marcar como lida:", error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta notificação?")) return

    try {
      const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

      if (error) throw error
      await fetchNotifications()
    } catch (error) {
      console.error("Erro ao excluir notificação:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("is_read", false)

      if (error) throw error
      await fetchNotifications()
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "vaccine_reminder":
        return AlertTriangle
      case "system":
        return Info
      default:
        return Bell
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "vaccine_reminder":
        return "text-destructive"
      case "system":
        return "text-secondary"
      default:
        return "text-accent"
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-accent" />
              <span>Notificações</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-start space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-xl"></div>
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-muted rounded mb-2"></div>
                    <div className="w-48 h-3 bg-muted rounded mb-1"></div>
                    <div className="w-24 h-3 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filtros</h2>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead} className="rounded-xl bg-transparent">
                <Check className="w-4 h-4 mr-2" />
                Marcar todas como lidas
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="rounded-xl"
            >
              Todas
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
              className="rounded-xl"
            >
              Não lidas {unreadCount > 0 && `(${unreadCount})`}
            </Button>
            <Button
              variant={filter === "vaccine_reminder" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("vaccine_reminder")}
              className="rounded-xl"
            >
              Vacinas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-accent" />
            <span>Notificações</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {filter === "unread"
                  ? "Nenhuma notificação não lida"
                  : filter === "vaccine_reminder"
                    ? "Nenhum lembrete de vacina"
                    : "Nenhuma notificação"}
              </h3>
              <p className="text-muted-foreground">
                {filter === "all"
                  ? "Você receberá notificações sobre vacinas e outros lembretes aqui"
                  : "Tente alterar o filtro para ver outras notificações"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                const iconColor = getNotificationColor(notification.type)

                return (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-3 p-4 border rounded-xl transition-colors ${
                      notification.is_read
                        ? "border-border bg-background"
                        : "border-accent/30 bg-accent/5 hover:bg-accent/10"
                    }`}
                  >
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3
                            className={`font-medium ${notification.is_read ? "text-muted-foreground" : "text-foreground"}`}
                          >
                            {notification.title}
                          </h3>
                          <p
                            className={`text-sm mt-1 ${notification.is_read ? "text-muted-foreground" : "text-foreground"}`}
                          >
                            {notification.message}
                          </p>
                          {notification.pets && (
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {notification.pets.species === "cachorro" ? "🐕" : "🐱"} {notification.pets.name}
                              </Badge>
                              {notification.vaccines && (
                                <Badge variant="secondary" className="text-xs">
                                  {notification.vaccines.name}
                                </Badge>
                              )}
                            </div>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                              </span>
                            </div>
                            {notification.scheduled_for && (
                              <div className="flex items-center space-x-1">
                                <Bell className="w-3 h-3" />
                                <span>
                                  Agendado:{" "}
                                  {format(new Date(notification.scheduled_for), "dd/MM/yyyy", { locale: ptBR })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead(notification.id)}
                              className="text-primary"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
