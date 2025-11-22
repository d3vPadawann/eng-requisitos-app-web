"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';
import { useToast } from "@/app/hooks/use-toast";

interface EditProfileFormProps {
  engineer: any;
  user: any;
}

export default function EditProfileForm({
  engineer,
  user,
}: EditProfileFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: engineer.bio || "",
    specialties: engineer.specialties || "",
    location: engineer.location || "",
    hourlyRate: engineer.hourlyRate || 0,
    yearsOfExp: engineer.yearsOfExp || 0,
    education: engineer.education || "",
    phone: engineer.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "hourlyRate" || name === "yearsOfExp" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/engineer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso!",
        });
      } else {
        toast({
          title: "Erro",
          description: "Falha ao atualizar perfil",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil",
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
          <label className="text-sm font-semibold">Nome Completo</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome completo"
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Sobre Você</label>
          <Textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Descreva sua experiência e abordagem profissional..."
            className="mt-2 h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Especialidades</label>
            <Input
              name="specialties"
              value={formData.specialties}
              onChange={handleChange}
              placeholder="Ex: Estrutura, Geotecnia, Hidráulica"
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Localização</label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ex: São Paulo, SP"
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Taxa Horária (R$)</label>
            <Input
              name="hourlyRate"
              type="number"
              value={formData.hourlyRate}
              onChange={handleChange}
              placeholder="0"
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Anos de Experiência</label>
            <Input
              name="yearsOfExp"
              type="number"
              value={formData.yearsOfExp}
              onChange={handleChange}
              placeholder="0"
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Formação Acadêmica</label>
          <Input
            name="education"
            value={formData.education}
            onChange={handleChange}
            placeholder="Ex: Engenharia Civil - USP"
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Telefone</label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(11) 99999-9999"
            className="mt-2"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Salvar Alterações
        </Button>
      </form>
    </Card>
  );
}
