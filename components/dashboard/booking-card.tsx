"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, User, Eye } from 'lucide-react';

interface BookingCardProps {
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
  };
  statusConfig: Record<string, { color: string; icon: any; label: string }>;
}

export default function BookingCard({ booking, statusConfig }: BookingCardProps) {
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  const config = statusConfig[booking.status];
  const StatusIcon = config?.icon;

  const badgeVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    yellow: "secondary",
    green: "default",
    blue: "default",
    red: "destructive",
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold">{booking.engineer.user.name}</h3>
            <p className="text-sm text-muted-foreground">Consultoria</p>
          </div>
          {StatusIcon && (
            <Badge variant={badgeVariants[config.color]}>
              {config.label}
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {startTime.toLocaleDateString("pt-BR")}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            {startTime.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" - "}
            {endTime.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            R${booking.amount.toFixed(2)}
          </div>
        </div>

        {/* Description */}
        {booking.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {booking.description}
          </p>
        )}

        {/* Action Button */}
        <Link href={`/dashboard/bookings/${booking.id}`} className="block">
          <Button variant="outline" className="w-full" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        </Link>
      </div>
    </Card>
  );
}
