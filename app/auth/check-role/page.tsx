import { redirect } from 'next/navigation';
import { prisma } from "@/lib/prisma";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function CheckRolePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const engineerProfile = await prisma.engineerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (engineerProfile) {
    redirect("/dashboard/engineer");
  }

  const clientProfile = await prisma.clientProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (clientProfile) {
    redirect("/dashboard");
  }

  redirect("/auth/setup-profile");
}
