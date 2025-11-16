import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import BookingForm from '@/components/booking/booking-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{
    engineerId?: string;
    availabilityId?: string;
  }>;
}) {
  const params = await searchParams;
  const { engineerId, availabilityId } = params;

  // Validate parameters
  if (!engineerId || !availabilityId) {
    redirect('/dashboard/engineers');
  }

  // Fetch engineer data
  const engineer = await prisma.engineerProfile.findUnique({
    where: { id: engineerId },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  // Fetch availability
  const availability = await prisma.availability.findUnique({
    where: { id: availabilityId },
  });

  if (!engineer || !availability) {
    redirect('/dashboard/engineers');
  }

  // Check if availability is still available and in the future
  const now = new Date();
  if (availability.startTime < now || !availability.isAvailable) {
    redirect('/dashboard/engineers/' + engineerId);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">ConexEng</div>
          <Link href={`/dashboard/engineers/${engineerId}`}>
            <Button variant="outline">Voltar</Button>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Agendar Consultoria</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="md:col-span-2">
              <BookingForm
                engineerId={engineerId}
                availabilityId={availabilityId}
                engineerName={engineer.user?.name || 'Engenheiro'}
                hourlyRate={engineer.hourlyRate}
                availabilityStart={availability.startTime}
                availabilityEnd={availability.endTime}
              />
            </div>

            {/* Summary */}
            <div>
              <Card className="p-6 sticky top-4 space-y-6">
                <div>
                  <h3 className="font-bold mb-3">Resumo da Consultoria</h3>
                </div>

                <div className="space-y-3 pb-4 border-b">
                  <div>
                    <p className="text-sm text-muted-foreground">Profissional</p>
                    <p className="font-semibold">{engineer.user?.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Data e Hora</p>
                    <p className="font-semibold">
                      {new Date(availability.startTime).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(availability.startTime).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' - '}
                      {new Date(availability.endTime).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Duração</p>
                    <p className="font-semibold">
                      {Math.round(
                        (new Date(availability.endTime).getTime() -
                          new Date(availability.startTime).getTime()) /
                          (1000 * 60)
                      )}{' '}
                      minutos
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Taxa Horária</p>
                    <p className="font-semibold">R${engineer.hourlyRate}/h</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Estimado</p>
                  <p className="text-2xl font-bold text-primary">
                    R${(
                      engineer.hourlyRate *
                      ((new Date(availability.endTime).getTime() -
                        new Date(availability.startTime).getTime()) /
                        (1000 * 60 * 60))
                    ).toFixed(2)}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  Após confirmar o agendamento, você terá acesso ao calendário de pagamento.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
