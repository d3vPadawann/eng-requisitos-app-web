import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import BookingDetails from "@/components/booking/booking-details"
import EngineerBookingView from "./engineer-view"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth.api.getSession({headers: await headers()});

  const { id } = await params

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      client: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
      engineer: {
        include: {
          user: {
            select: { name: true },
          },
        },
      },
    },
  })

  if (!booking) {
    redirect("/dashboard")
  }

  const isEngineer = session?.user?.id === booking.engineer.userId

  const statusConfig = {
    PENDING: { color: "yellow", icon: Clock, label: "Aguardando Pagamento" },
    CONFIRMED: { color: "green", icon: CheckCircle2, label: "Confirmado" },
    PAYMENT_AWAITING: { color: "yellow", icon: Clock, label: "Aguardando Pagamento" },
    PAYMENT_APPROVED: { color: "green", icon: CheckCircle2, label: "Pagamento Aprovado" },
    IN_PROGRESS: { color: "blue", icon: Clock, label: "Em Andamento" },
    COMPLETED: { color: "green", icon: CheckCircle2, label: "Concluído" },
    CANCELLED: { color: "red", icon: AlertCircle, label: "Cancelado" },
  }

  const config = statusConfig[booking.status as keyof typeof statusConfig]
  const StatusIcon = config.icon

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">ConexEng</div>
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {isEngineer ? (
            <EngineerBookingView booking={booking} isEngineer={true} />
          ) : (
            <>
              {/* Success Message */}
              <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
                <h1 className="text-2xl font-bold mb-2">Agendamento Realizado!</h1>
                <p className="text-muted-foreground">
                  Seu agendamento foi criado com sucesso. Agora você será direcionado para confirmar o pagamento.
                </p>
              </Card>

              {/* Booking Details */}
              <BookingDetails booking={booking} />

              {/* Next Steps */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Próximos Passos</h2>
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold">Confirme o Pagamento</p>
                      <p className="text-sm text-muted-foreground">Você receberá um link de pagamento por email</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold">Aguarde a Confirmação</p>
                      <p className="text-sm text-muted-foreground">
                        Após o pagamento ser aprovado, o agendamento será confirmado
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold">Conecte-se à Consultoria</p>
                      <p className="text-sm text-muted-foreground">
                        No horário agendado, você receberá um link para conectar-se
                      </p>
                    </div>
                  </li>
                </ol>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link href="/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Voltar ao Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/engineers" className="flex-1">
                  <Button className="w-full">Buscar Mais Engenheiros</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
