"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';
import { useToast } from "@/app/hooks/use-toast";

interface ActivityFormProps {
  engineerId: string;
  activityId?: string | null;
  onSaved: (activity: any) => void;
  onCancel: () => void;
}

export default function ActivityForm({
  engineerId,
  activityId,
  onSaved,
  onCancel,
}: ActivityFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    estimatedHours: 1,
  });

  useEffect(() => {
    if (activityId) {
      // Load activity data if editing
      const loadActivity = async () => {
        try {
          const response = await fetch(`/api/engineer/activities?id=${activityId}`);
          const data = await response.json();
          if (data.activity) {
            setFormData(data.activity);
          }
        } catch (error) {
          toast({ title: "Erro", description: "Falha ao carregar serviço", variant: "destructive" });
        }
      };
      loadActivity();
    }
  }, [activityId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "estimatedHours" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = activityId ? "PUT" : "POST";
      const response = await fetch("/api/engineer/activities", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          engineerId,
          id: activityId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({ title: "Sucesso", description: "Serviço salvo!" });
        onSaved(data.activity);
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao salvar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold">Título do Serviço</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Consultoria de Estrutura"
            className="mt-1"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Descrição</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descreva o serviço..."
            className="mt-1 h-20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Preço (R$)</label>
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              className="mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Horas Estimadas</label>
            <Input
              name="estimatedHours"
              type="number"
              value={formData.estimatedHours}
              onChange={handleChange}
              placeholder="1"
              className="mt-1"
              step="0.5"
              required
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar Serviço
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
