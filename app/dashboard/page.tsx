import Link from "next/link";
import { redirect } from 'next/navigation';
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import ClientDashboard from "@/components/dashboard/client-dashboard";
import { Search, LogOut } from 'lucide-react';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
   const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Get user and profile info
  const user = session.user;
  const clientProfile = await prisma.clientProfile.findUnique({
    where: { userId: user.id },
    include: {
      bookings: {
        include: {
          engineer: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
        orderBy: { startTime: "asc" },
      },
    },
  });

  // If no client profile, redirect to setup
  if (!clientProfile) {
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
              <Link href="/dashboard/engineers">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Profissionais
                </Button>
              </Link>
              <Link href="/api/auth/sign-out">
                <Button variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo, {user.name || "Cliente"}!
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus agendamentos de consultoria em um só lugar.
          </p>
        </div>

        {/* Dashboard Content */}
        <ClientDashboard bookings={clientProfile.bookings} />
      </main>
    </div>
  );
}
