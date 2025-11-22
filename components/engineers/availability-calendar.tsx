"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"

interface Availability {
  id: string
  startTime: Date | string
  endTime: Date | string
  isAvailable?: boolean
}

interface AvailabilityCalendarProps {
  engineerId: string
  availabilities: Availability[]
}

export default function AvailabilityCalendar({ engineerId, availabilities }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get all days in current month
  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  // Filter availabilities for current month
  const availabilitiesThisMonth = availabilities.filter((av) => {
    const avDate = new Date(av.startTime)
    return avDate.getFullYear() === currentDate.getFullYear() && avDate.getMonth() === currentDate.getMonth()
  })

  // Group by day
  const availableByDay = new Map<number, Availability[]>()
  availabilitiesThisMonth.forEach((av) => {
    const day = new Date(av.startTime).getDate()
    if (!availableByDay.has(day)) {
      availableByDay.set(day, [])
    }
    availableByDay.get(day)!.push(av)
  })

  const monthName = currentDate.toLocaleString("pt-BR", { month: "long", year: "numeric" })
  const days = Array.from({ length: daysInMonth(currentDate) }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth(currentDate) }, () => null)

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">Calendário de Disponibilidade</h2>

      <div className="space-y-6">
        {/* Calendar */}
        <div>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="font-semibold capitalize">{monthName}</h3>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {/* Day Headers */}
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}

            {/* Empty Days */}
            {emptyDays.map((_, idx) => (
              <div key={`empty-${idx}`} className="aspect-square" />
            ))}

            {/* Days with availability */}
            {days.map((day) => {
              const dayAvailabilities = availableByDay.get(day) || []
              const slotCount = dayAvailabilities.length
              const today = new Date()
              const isToday =
                day === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear()
              const isPast =
                currentDate.toDateString() ===
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString() &&
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < today

              return (
                <div
                  key={day}
                  className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-sm font-semibold cursor-pointer transition-all hover:shadow-md group ${
                    slotCount > 0 && !isPast
                      ? "border-green-300 bg-green-50 text-green-900 hover:bg-green-100"
                      : "border-border bg-card text-foreground cursor-not-allowed opacity-50"
                  } ${isToday ? "border-primary" : ""}`}
                  onClick={() => {
                    if (slotCount > 0 && !isPast) {
                      // Scroll to available times section and show only this day's times
                      const element = document.getElementById(`day-${day}`)
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "nearest" })
                        element.classList.add("ring-2", "ring-primary")
                        setTimeout(() => element.classList.remove("ring-2", "ring-primary"), 2000)
                      }
                    }
                  }}
                >
                  <div>{day}</div>
                  {slotCount > 0 && !isPast && <div className="text-xs text-green-600 mt-1">{slotCount} slot</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Available Time Slots */}
        {availabilitiesThisMonth.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Horários Disponíveis</h3>
            <div id="available-slots" className="space-y-4 max-h-96 overflow-y-auto">
              {Array.from(availableByDay.entries())
                .sort(([dayA], [dayB]) => dayA - dayB)
                .map(([day, dayAvailabilities]) => (
                  <div
                    key={`day-${day}`}
                    id={`day-${day}`}
                    className="border rounded-lg p-4 bg-card hover:bg-accent transition-colors"
                  >
                    <h4 className="font-semibold mb-3 text-sm">
                      {new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {dayAvailabilities.map((av) => {
                        const startTime = new Date(av.startTime)
                        const endTime = new Date(av.endTime)
                        const isAvailable = av.isAvailable !== false

                        return (
                          <Link
                            key={av.id}
                            href={
                              isAvailable ? `/dashboard/booking?engineerId=${engineerId}&availabilityId=${av.id}` : "#"
                            }
                          >
                            <Button
                              variant={isAvailable ? "default" : "ghost"}
                              disabled={!isAvailable}
                              className="w-full text-left justify-start flex flex-col items-start"
                            >
                              <Clock className="w-4 h-4 mb-1" />
                              <div className="text-xs">
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
                            </Button>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {availabilitiesThisMonth.length === 0 && (
          <p className="text-center text-muted-foreground py-6">Nenhum horário disponível no momento.</p>
        )}
      </div>
    </Card>
  )
}
