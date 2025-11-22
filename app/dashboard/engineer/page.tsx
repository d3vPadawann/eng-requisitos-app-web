import Link from "next/link";
import { redirect } from 'next/navigation';
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EngineerOverview from "@/components/engineer-dashboard/engineer-overview";
import BookingList from "@/components/engineer-dashboard/booking-list";
import { BarChart3, Calendar, Settings, LogOut, FileText } from 'lucide-react';
import SignoutButton from "@/components/SignoutButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function EngineerDashboardPage() {
   const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const user = session.user;
  const engineerProfile = await prisma.engineerProfile.findUnique({
    where: { userId: user.id },
    include: {
      bookings: {
        include: {
          client: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
        },
        orderBy: { startTime: "asc" },
      },
      activities: true,
      availability: {
        where: { startTime: { gte: new Date() } },
        take: 5,
        orderBy: { startTime: "asc" },
      },
    },
  });

  if (!engineerProfile) {
    redirect("/auth/setup-profile");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary">ConexEng</div>
            <nav className="flex items-center gap-2">
              <Link href="/dashboard/engineer/profile">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Perfil
                </Button>
              </Link>
              <Link href="/dashboard/engineer/schedule">
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agenda
                </Button>
              </Link>
              <SignoutButton />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Bem-vindo, {user.name || "Engenheiro"}!
              </h1>
              <p className="text-muted-foreground">
                Seu escritório virtual para gerenciar consultoria e projetos.
              </p>
            </div>
            {engineerProfile.isVerified && (
              <Badge className="h-fit">Verificado</Badge>
            )}
          </div>
        </div>

        {/* Overview Cards */}
        <EngineerOverview 
          engineerProfile={engineerProfile}
          bookings={engineerProfile.bookings}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Bookings */}
          <div className="lg:col-span-2">
            <BookingList bookings={engineerProfile.bookings} />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <Link href="/dashboard/engineer/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                </Link>
                <Link href="/dashboard/engineer/activities">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Gerenciar Serviços
                  </Button>
                </Link>
                <Link href="/dashboard/engineer/schedule">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Gerenciar Agenda
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Statistics */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Estatísticas</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Avaliações</p>
                  <p className="text-2xl font-bold">{engineerProfile.totalReviews}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Classificação</p>
                  <p className="text-2xl font-bold">{engineerProfile.rating.toFixed(1)}/5</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Próximos Agendamentos</p>
                  <p className="text-2xl font-bold">{engineerProfile.bookings.length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
