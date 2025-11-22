import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BookingStatus } from "@prisma/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Clock, User, FileText } from "lucide-react"
import Link from "next/link"

interface BookingListProps {
  bookings: any[]
}

const statusColors: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-900",
  CONFIRMED: "bg-blue-100 text-blue-900",
  PAYMENT_AWAITING: "bg-orange-100 text-orange-900",
  PAYMENT_APPROVED: "bg-green-100 text-green-900",
  IN_PROGRESS: "bg-purple-100 text-purple-900",
  COMPLETED: "bg-gray-100 text-gray-900",
  CANCELLED: "bg-red-100 text-red-900",
}

export default function BookingList({ bookings }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Nenhum agendamento ainda.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Agendamentos Recentes</h2>
      <div className="space-y-3">
        {bookings.slice(0, 10).map((booking) => (
          <Link key={booking.id} href={`/dashboard/bookings/${booking.id}`}>
            <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{booking.client.user.name}</span>
                    <Badge className={statusColors[booking.status]}>{booking.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {format(new Date(booking.startTime), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </div>
                  {booking.description && (
                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <span>{booking.description}</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">R${booking.amount.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
