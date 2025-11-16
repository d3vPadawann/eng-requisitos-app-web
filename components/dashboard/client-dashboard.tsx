"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingCard from "@/components/dashboard/booking-card";
import { Calendar, Clock, CheckCircle2, AlertCircle, X, Eye } from 'lucide-react';

interface Booking {
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
}

interface ClientDashboardProps {
  bookings: Booking[];
}

export default function ClientDashboard({ bookings }: ClientDashboardProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Categorize bookings
  const now = new Date();
  const upcoming = bookings.filter(b => new Date(b.startTime) > now);
  const completed = bookings.filter(b => 
    new Date(b.endTime) < now && (b.status === "COMPLETED" || b.status === "IN_PROGRESS")
  );
  const pending = bookings.filter(b => 
    b.status === "PENDING" || b.status === "PAYMENT_AWAITING" || b.status === "PAYMENT_APPROVED"
  );

  const statusConfig = {
    PENDING: { color: "yellow", icon: Clock, label: "Aguardando" },
    CONFIRMED: { color: "green", icon: CheckCircle2, label: "Confirmado" },
    PAYMENT_AWAITING: { color: "yellow", icon: Clock, label: "Pagamento" },
    PAYMENT_APPROVED: { color: "green", icon: CheckCircle2, label: "Aprovado" },
    IN_PROGRESS: { color: "blue", icon: Clock, label: "Em Andamento" },
    COMPLETED: { color: "green", icon: CheckCircle2, label: "Concluído" },
    CANCELLED: { color: "red", icon: X, label: "Cancelado" },
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Próximos Agendamentos
            </p>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {upcoming.length}
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
              Aguardando
            </p>
          </div>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
            {pending.length}
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
              Concluídos
            </p>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {completed.length}
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              Total
            </p>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {bookings.length}
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Próximos ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Aguardando ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Histórico ({completed.length})
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Bookings */}
        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map(booking => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking}
                  statusConfig={statusConfig}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">
                Nenhum agendamento próximo
              </p>
              <Link href="/dashboard/engineers">
                <Button>Buscar Profissionais</Button>
              </Link>
            </Card>
          )}
        </TabsContent>

        {/* Pending Bookings */}
        <TabsContent value="pending" className="space-y-4 mt-6">
          {pending.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pending.map(booking => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking}
                  statusConfig={statusConfig}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="text-muted-foreground">
                Todos os agendamentos foram confirmados!
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Completed Bookings */}
        <TabsContent value="completed" className="space-y-4 mt-6">
          {completed.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completed.map(booking => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking}
                  statusConfig={statusConfig}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                Nenhuma consultoria concluída ainda
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
