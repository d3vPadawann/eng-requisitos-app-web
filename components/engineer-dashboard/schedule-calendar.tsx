"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useToast } from "@/app/hooks/use-toast";

interface ScheduleCalendarProps {
  engineerId: string;
  availabilities: any[];
}

export default function ScheduleCalendar({
  engineerId,
  availabilities: initialAvailabilities,
}: ScheduleCalendarProps) {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilities, setAvailabilities] = useState(initialAvailabilities);

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este horário?")) return;

    try {
      const response = await fetch(`/api/engineer/availability?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setAvailabilities(availabilities.filter(a => a.id !== id));
        toast({ title: "Sucesso", description: "Horário removido!" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao remover", variant: "destructive" });
    }
  };

  const monthAvailabilities = availabilities.filter(av => {
    const avDate = new Date(av.startTime);
    return (
      avDate.getFullYear() === currentDate.getFullYear() &&
      avDate.getMonth() === currentDate.getMonth()
    );
  });

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">
            {currentDate.toLocaleString("pt-BR", { month: "long", year: "numeric" })}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {monthAvailabilities.length > 0 ? (
        <div className="space-y-2">
          {monthAvailabilities.map(av => (
            <Card key={av.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  {new Date(av.startTime).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(av.startTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} - {new Date(av.endTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(av.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center text-muted-foreground">
          Nenhum horário disponível neste mês.
        </Card>
      )}
    </div>
  );
}
