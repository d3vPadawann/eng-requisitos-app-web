"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BookingStatus } from "@prisma/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Clock, User, DollarSign, FileText, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface BookingDetailsProps {
  booking: any
  isEngineer: boolean
}

const statusConfig: Record<BookingStatus, { label: string; color: string; nextStates: BookingStatus[] }> = {
  PENDING: {
    label: "Pendente",
    color: "bg-yellow-100 text-yellow-900",
    nextStates: ["CONFIRMED", "CANCELLED"],
  },
  CONFIRMED: {
    label: "Confirmado",
    color: "bg-blue-100 text-blue-900",
    nextStates: ["IN_PROGRESS", "CANCELLED"],
  },
  PAYMENT_AWAITING: {
    label: "Aguardando Pagamento",
    color: "bg-orange-100 text-orange-900",
    nextStates: ["CANCELLED"],
  },
  PAYMENT_APPROVED: {
    label: "Pagamento Aprovado",
    color: "bg-green-100 text-green-900",
    nextStates: ["IN_PROGRESS", "CANCELLED"],
  },
  IN_PROGRESS: {
    label: "Em Andamento",
    color: "bg-purple-100 text-purple-900",
    nextStates: ["COMPLETED", "CANCELLED"],
  },
  COMPLETED: {
    label: "Concluído",
    color: "bg-gray-100 text-gray-900",
    nextStates: [],
  },
  CANCELLED: {
    label: "Cancelado",
    color: "bg-red-100 text-red-900",
    nextStates: [],
  },
}

export default function EngineerBookingView({ booking, isEngineer }: BookingDetailsProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(booking.status)
  const router = useRouter()

  const config = statusConfig[currentStatus as BookingStatus]
  const canUpdateStatus = isEngineer && config.nextStates.length > 0

  const handleStatusUpdate = async (newStatus: BookingStatus) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const updated = await response.json()
        setCurrentStatus(updated.status)
        router.refresh()
      } else {
        alert("Erro ao atualizar status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Erro ao atualizar status")
    } finally {
      setIsUpdating(false)
    }
  }

  const startTime = new Date(booking.startTime)
  const endTime = new Date(booking.endTime)
  const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60)

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Detalhes do Agendamento</h1>
          <Badge className={config.color}>{config.label}</Badge>
        </div>
      </Card>

      {/* Main Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Info */}
        <Card className="p-6">
          <h3 className="font-bold mb-4">Cliente</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{booking.client.user.name}</span>
            </div>
            <div className="text-sm text-muted-foreground">{booking.client.user.email}</div>
          </div>
        </Card>

        {/* Time & Duration */}
        <Card className="p-6">
          <h3 className="font-bold mb-4">Data e Hora</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-semibold">{format(startTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                <p className="text-sm text-muted-foreground">
                  {format(startTime, "HH:mm", { locale: ptBR })} - {format(endTime, "HH:mm", { locale: ptBR })} (
                  {durationMinutes} min)
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Amount */}
        <Card className="p-6">
          <h3 className="font-bold mb-4">Valor</h3>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-3xl font-bold">R$ {booking.amount.toFixed(2)}</span>
          </div>
        </Card>

        {/* Description */}
        {booking.description && (
          <Card className="p-6">
            <h3 className="font-bold mb-4">Descrição</h3>
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-muted-foreground mt-1" />
              <p className="text-sm">{booking.description}</p>
            </div>
          </Card>
        )}
      </div>

      {/* Status Update Actions */}
      {isEngineer && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold mb-3">Ações Disponíveis</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Status atual: <span className="font-semibold">{config.label}</span>
              </p>

              {canUpdateStatus ? (
                <div className="flex flex-wrap gap-2">
                  {config.nextStates.map((nextStatus) => {
                    const nextConfig = statusConfig[nextStatus]
                    return (
                      <Button
                        key={nextStatus}
                        onClick={() => handleStatusUpdate(nextStatus)}
                        disabled={isUpdating}
                        className="gap-2"
                      >
                        {nextStatus === "COMPLETED" ? "Marcar como Concluído" : `Mudar para ${nextConfig.label}`}
                      </Button>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhuma ação disponível para este status.</p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
