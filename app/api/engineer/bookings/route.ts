import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const engineer = await prisma.engineerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!engineer) {
      return NextResponse.json({ error: "Engineer profile not found" }, { status: 404 });
    }

    const bookings = await prisma.booking.findMany({
      where: { engineerId: engineer.id },
      include: {
        client: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
        availability: true,
      },
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
