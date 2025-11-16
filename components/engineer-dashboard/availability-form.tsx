"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

interface AvailabilityFormProps {
  engineerId: string;
  onSaved: (availability: any) => void;
  onCancel: () => void;
}

export default function AvailabilityForm({
  engineerId,
  onSaved,
  onCancel,
}: AvailabilityFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/engineer/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          engineerId,
          startTime: new Date(formData.startTime),
          endTime: new Date(formData.endTime),
          isAvailable: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({ title: "Sucesso", description: "Horário adicionado!" });
        onSaved(data.availability);
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao adicionar horário", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Início</label>
            <Input
              name="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Fim</label>
            <Input
              name="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Adicionar Horário
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
