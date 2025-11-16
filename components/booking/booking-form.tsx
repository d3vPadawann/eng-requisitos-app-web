"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

interface BookingFormProps {
  engineerId: string;
  availabilityId: string;
  engineerName: string;
  hourlyRate: number;
  availabilityStart: Date | string;
  availabilityEnd: Date | string;
}

export default function BookingForm({
  engineerId,
  availabilityId,
  engineerName,
  hourlyRate,
  availabilityStart,
  availabilityEnd,
}: BookingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");

  const startDate = new Date(availabilityStart);
  const endDate = new Date(availabilityEnd);
  const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const totalAmount = hourlyRate * durationHours;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engineerId,
          availabilityId,
          description,
          amount: totalAmount,
          startTime: availabilityStart,
          endTime: availabilityEnd,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao criar agendamento");
      }

      const booking = await response.json();

      toast({
        title: "Consultoria Agendada!",
        description: `Seu agendamento com ${engineerName} foi confirmado.`,
      });

      // Redirect to booking confirmation
      router.push(`/dashboard/bookings/${booking.id}`);
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao agendar consultoria",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-2">
            Descreva sua necessidade
          </label>
          <Textarea
            id="description"
            placeholder="Conte-nos mais sobre o que você precisa de consultoria. Isso ajuda o profissional a se preparar melhor."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Mínimo de 10 caracteres, máximo de 1000
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm">
            <span className="font-semibold text-blue-900 dark:text-blue-100">
              Aviso Importante:
            </span>
            {' '}
            <span className="text-blue-800 dark:text-blue-200">
              Após confirmar, você será direcionado para o pagamento. O agendamento será confirmado apenas após a aprovação do pagamento.
            </span>
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            className="flex-1"
            disabled={loading || description.length < 10}
            size="lg"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirmar e Pagar
          </Button>
        </div>
      </form>
    </Card>
  );
}
