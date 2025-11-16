"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';
import { useToast } from "@/app/hooks/use-toast";

export default function SetupProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userType: "client",
    bio: "",
    phone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/profile/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao configurar perfil");
      }

      toast({
        title: "Perfil Criado!",
        description: "Sua conta foi configurada com sucesso.",
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao configurar perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-6">Configure seu Perfil</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="userType" className="block text-sm font-semibold mb-2">
              Tipo de Usuário
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="client">Cliente</option>
            </select>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-semibold mb-2">
              Sobre Você (Opcional)
            </label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Conte um pouco sobre você..."
              value={formData.bio}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold mb-2">
              Telefone (Opcional)
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            size="lg"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Continuar
          </Button>
        </form>
      </Card>
    </div>
  );
}
