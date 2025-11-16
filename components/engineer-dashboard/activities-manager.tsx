"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ActivityForm from "./activity-form";
import { Trash2, Edit2, Plus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ActivitiesManagerProps {
  engineerId: string;
  activities: any[];
}

export default function ActivitiesManager({
  engineerId,
  activities: initialActivities,
}: ActivitiesManagerProps) {
  const { toast } = useToast();
  const [activities, setActivities] = useState(initialActivities);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este serviço?")) return;

    try {
      const response = await fetch(`/api/engineer/activities?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setActivities(activities.filter(a => a.id !== id));
        toast({ title: "Sucesso", description: "Serviço deletado!" });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao deletar", variant: "destructive" });
    }
  };

  const handleActivitySaved = (newActivity: any) => {
    if (editingId) {
      setActivities(activities.map(a => a.id === editingId ? newActivity : a));
    } else {
      setActivities([...activities, newActivity]);
    }
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Seus Serviços</h2>
        <Button onClick={() => { setEditingId(null); setShowForm(!showForm); }}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      {showForm && (
        <ActivityForm
          engineerId={engineerId}
          activityId={editingId}
          onSaved={handleActivitySaved}
          onCancel={() => { setShowForm(false); setEditingId(null); }}
        />
      )}

      <div className="grid gap-4">
        {activities.map(activity => (
          <Card key={activity.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold mb-1">{activity.title}</h3>
                {activity.description && (
                  <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold">R${activity.price.toFixed(2)}</span>
                  <span className="text-muted-foreground">{activity.estimatedHours}h estimadas</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setEditingId(activity.id); setShowForm(true); }}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(activity.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
