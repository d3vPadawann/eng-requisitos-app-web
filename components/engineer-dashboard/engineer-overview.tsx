import { Card } from "@/components/ui/card";
import { BookingStatus } from "@prisma/client";
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface EngineerOverviewProps {
  engineerProfile: any;
  bookings: any[];
}

export default function EngineerOverview({
  engineerProfile,
  bookings,
}: EngineerOverviewProps) {
  const upcoming = bookings.filter(b => b.status === BookingStatus.CONFIRMED && new Date(b.startTime) > new Date());
  const pending = bookings.filter(b => b.status === BookingStatus.PENDING);
  const completed = bookings.filter(b => b.status === BookingStatus.COMPLETED);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Próximos Agendamentos</p>
            <p className="text-3xl font-bold">{upcoming.length}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Clock className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="text-sm text-muted-foreground">Pendentes</p>
            <p className="text-3xl font-bold">{pending.length}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">Concluídos</p>
            <p className="text-3xl font-bold">{completed.length}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <AlertCircle className="w-8 h-8 text-purple-500" />
          <div>
            <p className="text-sm text-muted-foreground">Serviços</p>
            <p className="text-3xl font-bold">{engineerProfile.activities.length}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
