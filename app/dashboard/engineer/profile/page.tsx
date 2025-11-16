import { redirect } from 'next/navigation';
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-client";
import EditProfileForm from "@/components/engineer-dashboard/edit-profile-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';

export default async function EngineerProfilePage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const engineer = await prisma.engineerProfile.findUnique({
    where: { userId: session.user.id },
    include: { user: true },
  });

  if (!engineer) {
    redirect("/auth/setup-profile");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/engineer">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Editar Perfil</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl">
          <EditProfileForm engineer={engineer} user={session.user} />
        </div>
      </main>
    </div>
  );
}
