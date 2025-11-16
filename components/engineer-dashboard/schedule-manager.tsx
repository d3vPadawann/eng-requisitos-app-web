"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AvailabilityForm from "./availability-form";
import ScheduleCalendar from "./schedule-calendar";
import { Plus } from 'lucide-react';

interface ScheduleManagerProps {
  engineerId: string;
  availabilities: any[];
}

export default function ScheduleManager({
  engineerId,
  availabilities: initialAvailabilities,
}: ScheduleManagerProps) {
  const [availabilities, setAvailabilities] = useState(initialAvailabilities);
  const [showForm, setShowForm] = useState(false);

  const handleAvailabilitySaved = (newAvailability: any) => {
    setAvailabilities([...availabilities, newAvailability]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Sua Agenda</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Horário
        </Button>
      </div>

      {showForm && (
        <AvailabilityForm
          engineerId={engineerId}
          onSaved={handleAvailabilitySaved}
          onCancel={() => setShowForm(false)}
        />
      )}

      <ScheduleCalendar
        engineerId={engineerId}
        availabilities={availabilities}
      />
    </div>
  );
}
