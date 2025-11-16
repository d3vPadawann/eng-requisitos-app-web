"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, User, FileText } from 'lucide-react';

interface BookingDetailsProps {
  booking: {
    id: string;
    status: string;
    startTime: Date;
    endTime: Date;
    amount: number;
    description: string | null;
    engineer: {
      user: {
        name: string | null;
      };
    };
    client: {
      user: {
        name: string | null;
        email: string | null;
      };
    };
  };
}

export default function BookingDetails({ booking }: BookingDetailsProps) {
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

  const statusBadgeMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    PENDING: "secondary",
    CONFIRMED: "default",
    PAYMENT_AWAITING: "secondary",
    PAYMENT_APPROVED: "default",
    IN_PROGRESS: "default",
    COMPLETED: "default",
    CANCELLED: "destructive",
  };

  const statusLabelMap: Record<string, string> = {
    PENDING: "Aguardando Pagamento",
    CONFIRMED: "Confirmado",
    PAYMENT_AWAITING: "Aguardando Pagamento",
    PAYMENT_APPROVED: "Pagamento Aprovado",
    IN_PROGRESS: "Em Andamento",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado",
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Status */}
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-lg font-bold">Status do Agendamento</h2>
        <Badge variant={statusBadgeMap[booking.status] || "default"}>
          {statusLabelMap[booking.status] || booking.status}
        </Badge>
      </div>

      {/* Booking ID */}
      <div className="text-sm">
        <p className="text-muted-foreground">ID do Agendamento</p>
        <p className="font-mono font-semibold">{booking.id}</p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div className="flex gap-3">
          <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Data</p>
            <p className="font-semibold">{startTime.toLocaleDateString("pt-BR")}</p>
          </div>
        </div>

        {/* Time */}
        <div className="flex gap-3">
          <Clock className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Horário</p>
            <p className="font-semibold">
              {startTime.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" - "}
              {endTime.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Engineer */}
        <div className="flex gap-3">
          <User className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Profissional</p>
            <p className="font-semibold">{booking.engineer.user.name}</p>
          </div>
        </div>

        {/* Amount */}
        <div className="flex gap-3">
          <DollarSign className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Valor Total</p>
            <p className="font-semibold text-lg">R${booking.amount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      {booking.description && (
        <div className="pt-4 border-t">
          <div className="flex gap-3">
            <FileText className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Descrição da Consultoria</p>
              <p className="text-foreground">{booking.description}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
