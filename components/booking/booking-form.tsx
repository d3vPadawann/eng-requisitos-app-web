"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useToast } from "@/app/hooks/use-toast"

interface BookingFormProps {
  engineerId: string
  availabilityId: string
  engineerName: string
  hourlyRate: number
  availabilityStart: Date | string
  availabilityEnd: Date | string
}

export default function BookingForm({
  engineerId,
  availabilityId,
  engineerName,
  hourlyRate,
  availabilityStart,
  availabilityEnd,
}: BookingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState("")

  const startDate = new Date(availabilityStart)
  const endDate = new Date(availabilityEnd)
  const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
  const totalAmount = hourlyRate * durationHours

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("[v0] Submitting booking with:", {
        engineerId,
        availabilityId,
        description,
        amount: totalAmount,
      })

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engineerId,
          availabilityId,
          description: description || "Sem descrição adicional",
          amount: totalAmount,
          startTime: availabilityStart,
          endTime: availabilityEnd,
        }),
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const error = await response.json()
        console.log("[v0] Error response:", error)
        throw new Error(error.message || "Erro ao criar agendamento")
      }

      const booking = await response.json()
      console.log("[v0] Booking created:", booking)

      toast({
        title: "Consultoria Agendada!",
        description: `Seu agendamento com ${engineerName} foi confirmado.`,
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Error:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao agendar consultoria",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-2">
            Descreva sua necessidade (opcional)
          </label>
          <Textarea
            id="description"
            placeholder="Conte-nos mais sobre o que você precisa de consultoria. Isso ajuda o profissional a se preparar melhor."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-2">Máximo de 1000 caracteres</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm">
            <span className="font-semibold text-blue-900 dark:text-blue-100">Aviso Importante:</span>{" "}
            <span className="text-blue-800 dark:text-blue-200">
              Após confirmar, seu agendamento será salvo e você verá em seu dashboard. O engenheiro será notificado.
            </span>
          </p>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1" disabled={loading} size="lg">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirmar Agendamento
          </Button>
        </div>
      </form>
    </Card>
  )
}
