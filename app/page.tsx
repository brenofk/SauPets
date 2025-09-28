import { Button } from "@/components/ui/button"
import { Heart, Shield, Bell, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 sm:py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">SauPet</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="sm" asChild className="text-sm sm:text-base">
              <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button asChild className="rounded-xl text-sm sm:text-base h-10 sm:h-auto">
              <Link href="/auth/register">Cadastrar</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-3xl mb-6 sm:mb-8">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6 text-balance leading-tight">
            Cuidado veterinário na palma da sua mão
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            Gerencie a saúde dos seus pets com facilidade. Controle vacinas, receba lembretes e mantenha tudo organizado
            em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16">
            <Button
              size="lg"
              asChild
              className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl text-base sm:text-lg w-full sm:w-auto"
            >
              <Link href="/auth/register">Começar Agora</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl text-base sm:text-lg bg-transparent w-full sm:w-auto"
            >
              <Link href="/auth/login">Já tenho conta</Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
            <div className="text-center p-4 sm:p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-secondary/20 rounded-2xl mb-3 sm:mb-4">
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-secondary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Controle de Vacinas</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Mantenha o histórico completo de vacinas dos seus pets sempre atualizado
              </p>
            </div>

            <div className="text-center p-4 sm:p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-accent/20 rounded-2xl mb-3 sm:mb-4">
                <Bell className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Lembretes Automáticos</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Receba notificações para nunca esquecer das próximas vacinas
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 sm:col-span-2 md:col-span-1">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-chart-4/20 rounded-2xl mb-3 sm:mb-4">
                <Users className="w-7 h-7 sm:w-8 sm:h-8 text-chart-4" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Múltiplos Pets</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Gerencie todos os seus cães e gatos em um só aplicativo
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
